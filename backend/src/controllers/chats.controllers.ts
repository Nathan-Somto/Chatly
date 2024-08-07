import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/connectDb";
import { v4 as uuidv4 } from "uuid";
import { checkIfAdminOrOwner } from "../utils/checkIfAdminOrOwner";

/**
 * @method GET
 * @description gets messages under a specific chat
 * @param req
 * @param res
 * @route /api/v1/chats/:chatId/messages?page&pageSize
 */
const getChatMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    let { page = 1, pageSize = 10 } = req.query;
    const { userId } = req.body;
    if (isNaN(+pageSize)) {
      pageSize = 10;
    }
    if (isNaN(+page) || +page <= 0) {
      page = 1;
    }
    const q = [
      {
        members: {
          some: {
            userId,
          },
        },
      },
      {
        id: chatId,
      },
    ];
    const totalSize = await prisma.chat.count({
      where: {
        AND: q,
      },
    });
    const pages = Math.ceil(totalSize / (pageSize as number));
    page = Math.min(pages, page as number);
    const messages = await prisma.chat.findFirst({
      where: {
        AND: q,
      },
      include: {
        message: {
          take: pageSize as number,
          skip: (page - 1) * (pageSize as number),
          orderBy: {
            createdAt: "asc",
          },
          select: {
            resourceUrl: true,
            body: true,
            isEditted: true,
            isReply: true,
            parentMessageId: true,
            id: true,
            type: true,
            readByIds: true,
            createdAt: true,
            Sender: {
              select: {
                avatar: true,
                username: true,
                id: true,
                Member: {
                  take: 1,
                  where: {
                    chatId,
                  },
                  select: {
                    role: true,
                  },
                },
              },
            },
            ParentMessage: {
              select: {
                Sender: {
                  select: {
                    avatar: true,
                    username: true,
                  },
                },
                body: true,
              },
            },
          },
        },
      },
    });
    const formattedMessages = messages?.message.map((message) => ({
      ...message,
      ParentMessage: message?.ParentMessage
        ? {
            avatar: message.ParentMessage.Sender.avatar,
            userame: message.ParentMessage.Sender.username,
            body: message.ParentMessage?.body,
          }
        : null,
    }));
    res.status(200).json({
      message: "chat's messages",
      messages: formattedMessages ?? [],
      pages,
      pageSize,
      page,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method GET
 * @description gets the members for a specific chat.
 * @param req
 * @param res
 * @route /api/v1/chats/:chatId/members
 */
const getGroupChatMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { chatId } = req.params;
    const chatMembers = await prisma.chat.findUnique({
      where: {
        id: chatId,
        members: {
          some: {
            userId,
          },
        },
        isGroup: true,
      },
      select: {
        members: {
          select: {
            user: {
              select: {
                id: true,
                lastSeen: true,
                username: true,
                avatar: true,
              },
            },
            role: true,
          },
        },
      },
    });
    if (chatMembers === null) {
      res.status(404).json({
        message: "group chat not found",
      });
      return;
    }
    const formattedMembers = chatMembers.members.map((member) => ({
      ...member.user,
      role: member.role,
    }));
    res.status(200).json({
      message: "retrieved group chat members",
      chatMembers: formattedMembers,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @method POST
 * @param req
 * @param res
 * @route /api/v1/chats/create-groupchat
 * @description creates a private Chat / group Chat which can be private or public.
 */
const createGroupChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, members, privacy, ownerName, ownerId } =
      req.body;
    const clerkId = req.auth.userId;
    if (Array.isArray(members) && members.length >= 2) {
      const isValidMembers = members.every(
        (item) =>
          typeof item?.value !== "undefined" &&
          typeof item.value === "string" &&
          item.value.length > 0
      );
      if (!isValidMembers) {
        return res.status(400).json({
          success: false,
          message:
            "data sent is poorly formatted,\nall member objects must have a value ",
        });
      }
      const groupChat = await prisma.chat.create({
        data: {
          name,
          description,
          privacy,
          isGroup: true,
          inviteCode: uuidv4(),
          members: {
            create: members.map((member) => ({
              joinedAt: new Date(),
              user: { connect: { id: member.value } },
              role: member?.isOwner ? "OWNER" : "MEMBER",
            })),
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          privacy: true,
          members: {
            take: 3,
            select: {
              user: {
                select: {
                  avatar: true,
                  username: true,
                },
              },
            },
          },
        },
      });
      const firstMessage = await prisma.message.create({
        data: {
          chatId: groupChat.id,
          body: `${ownerName} created a group chat`,
          senderId: ownerId,
          type: "SYSTEM",
        },
      });
      const formattedGroupChat = {
        ...groupChat,
        // remove members property replace with avatars prop which is string[]
        avatars: groupChat.members.map((member) => member.user.avatar),
        members: groupChat.members
          .slice(3)
          .map((member) => member.user.username),
      };
      res.status(201).json({
        message: "successfully created group chat!",
        groupChat: formattedGroupChat,
        firstMessage,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "members must be an array and have a length of at least 2",
        success: false,
      });
    }
  } catch (err) {
    next(err);
  }
};
/**
 * @method PATCH
 * @param req
 * @param res
 * @route /api/v1/chats/:chatId/mark-as-read
 * @description reads a user's chat!
 */
const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, messageId } = req.body;
    const { chatId } = req.params;
    const message = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        readByIds: {
          push: userId,
        },
      },
    });
    if (!message) {
      res.status(400).json({
        message: "message does not exist!",
        success: true,
      });
    }
    const foundMember = await prisma.member.findFirst({
      where: {
        AND: [{ chatId }, { userId }],
      },
    });
    await prisma.member.update({
      where: {
        id: foundMember?.id,
      },
      data: {
        readMessagesIds: {
          push: messageId,
        },
      },
    });
    return res.status(200).json({
      data: message,
      success: true,
      message: "succesfully read message!",
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method POST
 * @param req
 * @description creates a private message / direct message between two persons
 * @param res
 * @route /api/v1/chats/create-dm
 */
const createDmChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { members } = req.body;
    if (Array.isArray(members) && members.length == 2) {
      if (
        typeof members[0]?.userId !== "string" ||
        typeof members[1]?.userId !== "string"
      ) {
        return res.status(400).json({
          message: "userId must be present on both members and be a string!",
          success: false,
        });
      }
      const chatExists = await prisma.chat.findFirst({
        where: {
          AND: [
            { members: { some: { userId: members[0].userId } } },
            { members: { some: { userId: members[1].userId } } },
            { isGroup: false },
          ],
        },
        select: {
          id: true,
          name: true,
          description: true,
          privacy: true,
          members: {
            select: {
              user: {
                select: {
                  username: true,
                  avatar: true,
                  lastSeen: true,
                },
              },
            },
          },
        },
      });
      if (chatExists) {
        res.status(200).json({
          message: "retrieved created chat",
          privateChat: chatExists,
        });
        return;
      }
      const chat = await prisma.chat.create({
        data: {
          privacy: "PRIVATE",
          isGroup: false,
          inviteCode: "",
          members: {
            create: members.map((member) => ({
              user: { connect: { id: member.userId } },
              role: "MEMBER",
              joinedAt: new Date(),
            })),
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          privacy: true,
          members: {
            select: {
              user: {
                select: {
                  username: true,
                  avatar: true,
                  lastSeen: true,
                },
              },
            },
          },
        },
      });
      res.status(201).json({
        message: "successfully created private message",
        privateChat: chat,
      });
    } else {
      res.status(400).json({
        message: "there must be exactly two persons in a private message",
        success: false,
      });
    }
  } catch (err) {
    next(err);
  }
};
/**
 * @method POST
 * @param req
 * @param res
 * @description allows a user to join either a public / private group chat via a link.
 * @route /api/v1/chats/:chatId/join-via-link
 */
const joinViaLink = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { inviteCode, userId } = req.body;
    const { chatId } = req.params;
    const groupChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        inviteCode,
        isGroup: true,
      },
      include: {
        members: {
          where: {
            userId,
          },
        },
      },
    });
    if (groupChat === null) {
      res.status(404).json({
        message: "group chat could not be found! either invalid code or chatId",
        success: false,
      });
      return;
    }
    if (groupChat?.members.length) {
      res.status(200).json({
        chatId,
        message: "user already part of gorup chat!",
        success: true,
      });
    }
    await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        members: {
          create: {
            role: "MEMBER",
            userId,
            joinedAt: new Date(),
          },
        },
      },
    });
    return res.status(200).json({
      chatId,
      message: "user has been added to the group chat!",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method POST
 * @param req
 * @param res
 * @description allows a user to join a public group chat.
 * @route /api/v1/chats/:chatId/join
 */
const joinPublicGroupChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { chatId } = req.params;
    const { userId, username } = req.body;
    const groupChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        isGroup: true,
        privacy: "PUBLIC",
      },
      select: {
        members: {
          where: {
            userId,
          },
        },
      },
    });
    if (!groupChat) {
      res.status(404).json({
        message: "group chat does not exist!",
        chatId,
      });
    }
    if (groupChat?.members.length) {
      return res.status(400).json({
        message: "user is already in the group Chat",
        userId,
        groupChat,
      });
    }
    const updatedGroupChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        members: {
          create: {
            userId,
            joinedAt: new Date(),
            role: "MEMBER",
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        privacy: true,
        members: {
          take: 3,
          select: {
            user: {
              select: {
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    // create user joined message
    const joinedMessage = await prisma.message.create({
      data: {
        chatId,
        body: `${username} joined the group chat!`,
        senderId: userId,
        type: "SYSTEM",
      },
    });
    const formattedGroupChat = {
      ...updatedGroupChat,
      // remove members property replace with avatars prop which is string[]
      avatars: updatedGroupChat.members.map((member) => member.user.avatar),
      members: updatedGroupChat.members
        .slice(3)
        .map((member) => member.user.username),
    };
    return res.status(200).json({
      message: "successfully added user to group chat!",
      groupChat: formattedGroupChat,
      joinedMessage,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method PATCH
 * @description edits certain descriptive elements of group chats, only admin / owner members have rights
 * @param req
 * @param res
 * @requires checkIfAdmin
 * @route /api/v1/chats/:chatId
 */
const editChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    const { userId, name, description, privacy } = req.body;
    if (typeof userId !== "string" && typeof chatId !== "string") {
      return res.status(400).json({
        message: "ensure that userId and chatId are type strings",
        success: false,
      });
    }
    const isAdminOrOwner = await checkIfAdminOrOwner(userId, chatId);
    if (isAdminOrOwner) {
      const groupChat = await prisma.chat.findUnique({
        where: {
          id: chatId,
          isGroup: true,
        },
        select: {
          description: true,
          name: true,
          privacy: true,
        },
      });
      const updatedName = name || groupChat?.name;
      const updatedDescription = description || groupChat?.description;
      const updatedPrivacy = privacy || groupChat?.privacy;
      const updatedGroupChat = await prisma.chat.update({
        where: {
          id: chatId,
          isGroup: true,
        },
        data: {
          name: updatedName,
          description: updatedDescription,
          privacy: updatedPrivacy,
        },
      });
      res.status(200).json({
        message: "succesfully updated group chat",
        updatedGroupChat,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "user does not have administrative access",
        success: false,
      });
    }
  } catch (err) {
    next(err);
  }
};
/**
 * @method PATCH
 * @description add's  members to group chats, accepts an array of members.
 * @param req
 * @param res
 * @route  /api/v1/chats/:chatId/add-members
 */
const addMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;
    const isMemberAdded = await prisma.member.findFirst({
      where: {
        chatId,
        userId,
      },
    });
    if (isMemberAdded) {
      return res.status(400).json({
        message: "member already added!",
        success: false,
      });
    }
    await prisma.chat.update({
      where: { id: chatId, isGroup: true },
      data: {
        members: {
          create: {
            joinedAt: new Date(),
            userId,
            role: "MEMBER",
          },
        },
      },
    });
    return res.status(200).json({
      message: "succesfully added user",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method PATCH
 * @description allows a user to leave a group chat, requires userId in body.
 * @param req
 * @param res
 * @route /api/v1/chats/:chatId/leave
 *
 */
const leaveChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = req.auth.userId;
    const { chatId } = req.params;
    const { username } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
      },
    });
    if (user === null) {
      throw new Error("user not found!");
    }
    const userId = user?.id;
    const groupChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        isGroup: true,
        members: {
          some: {
            userId,
          },
        },
      },
    });
    if (groupChat === null) {
      return res.status(400).json({
        message: "user has left or this is not a group chat!",
        success: false,
      });
    }
    const member = await prisma.member.findFirst({
      where: {
        chatId,
        userId,
      },
    });
    if (member === null) {
      return res.status(400).json({
        message: "user is not a member of this group chat",
        success: false,
      });
    }
    await prisma.member.delete({
      where: {
        id: member?.id,
      },
    });
    const leftMessage = await prisma.message.create({
      data: {
        chatId: groupChat.id,
        body: `${username} left the group chat`,
        senderId: userId,
        type: "SYSTEM",
      },
    });
    // once done emit to everyone in the chat!
    return res.status(201).json({
      message: "succesfully left group chat!",
      success: true,
      leftMessage,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method PATCH
 * @description makes a member an admin or member
 * @param req
 * @param res
 * @route /api/v1/chats/:chatId/change-role
 */
const changeRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminId, targetUserId, role } = req.body;
    const { chatId } = req.params;
    if (typeof targetUserId !== "string") {
      return res.status(400).json({
        success: false,
        message: "target user id must be of type string",
      });
    }
    if (role !== "MEMBER" && role !== "ADMIN") {
      return res.status(400).json({
        success: false,
        message: "role must be either MEMBER or ADMIN",
      });
    }
    const isUser1Admin = await checkIfAdminOrOwner(adminId, chatId);
    if (!isUser1Admin) {
      return res.status(400).json({
        success: false,
        message:
          "you cannot make this user an admin!\nbecome an admin first\nconsider asking your owner or another admin.",
      });
    }
    const foundMember = await prisma.member.findFirst({
      where: {
        AND: [{ chatId }, { userId: targetUserId }],
      },
    });
    const member = await prisma.member.update({
      where: {
        id: foundMember?.id,
      },
      data: {
        role: role === "ADMIN" ? "MEMBER" : "ADMIN",
      },
      include: {
        user: {
          select: {
            avatar: true,
            lastSeen: true,
            username: true,
            id: true,
          },
        },
      },
    });
    res.status(200).json({
      message: `successfully made the ${
        role === "ADMIN" ? "user a member" : "member an admin!"
      }`,
      member,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method DELETE
 * @param req
 * @description deletes a particular group chat
 * @param res
 * @route /api/v1/chats/:chatId/group-chat
 * @requires checkIfAdmin
 */
const deleteGroupChat = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { chatId } = req.params;
    const isAdminOrOwner = await checkIfAdminOrOwner(userId, chatId);
    if (!isAdminOrOwner) {
      res.status(400).json({ message: "user is not an admin or owner" });
      return;
    }
    const groupChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        isGroup: true,
        members: {
          some: {
            userId,
          },
        },
      },
    });
    if (groupChat === null) {
      res.status(400).json({
        message:
          "group chat does not exist or you can't delete a private message chat!",
        success: false,
      });
      return;
    }
    await prisma.chat.delete({
      where: {
        id: chatId,
        isGroup: true,
      },
    });
    res.status(202).json({
      message: "successfully deleted group chat!",
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export {
  getGroupChatMembers,
  getChatMessages,
  joinViaLink,
  editChat,
  addMembers,
  leaveChat,
  deleteGroupChat,
  createDmChat,
  joinPublicGroupChat,
  createGroupChat,
  changeRole,
  markAsRead,
};
