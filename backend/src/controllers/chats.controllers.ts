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
            createdAt: "desc",
          },
          include: {
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
          },
        },
      },
         });
         
    res.status(200).json({
      message: "chat's messages",
      data: messages ?? [],
      success: true
    });
  } catch (err) {
    next(err)
  }
};
/**
 * @method GET
 * @description gets the details for a specific chat including its members.
 * @param req
 * @param res
 * @route /api/v1/chats/:chatId
 */
const getChatDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.body;
    const { chatId } = req.params;
    const chatDetails = await prisma.chat.findUnique({
      where: {
        id: chatId,
        members: {
          some: {
            userId,
          },
        },
        isGroup: true,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                lastSeen: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
    if (chatDetails === null) {
      res.status(400).json({
        message: "you cannot access chat details",
      });
      return;
    }
    res.status(200).json({
      message: "retrieved chat details",
      chatDetails,
    });
  } catch (err) {
    next(err)
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
    const { name, description, members, privacy, ownerId } = req.body;
    /* member -> {
      value: string,
      label: string
    }[]
    */
    if (Array.isArray(members) && members.length >= 3) {
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
              role: member.value === ownerId ? "OWNER" : "MEMBER",
            })),
          },
        },
      });
      res.status(201).json({
        message: "successfully created group chat!",
        groupChat,
        success: true,
      });
    } else {
      res.status(400).json({
        message: "members must be an array and have a length of at least 3",
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
    await prisma.member.update({
      where: {
        userId: userId,
        chatId,
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
    const { userId } = req.body;
    const groupChat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        isGroup: true,
        privacy: "PUBLIC",
      },
      include: {
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
      include: {
        members: true,
      },
    });
    return res.status(200).json({
      message: "successfully added user to group chat!",
      updatedGroupChat,
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
    const { userId } = req.body;
    const { chatId } = req.params;
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
      return res
        .status(400)
        .json({
          message: "user has left or this is not a group chat!",
          success: false,
        });
    }
    await prisma.member.delete({
      where: {
        chatId,
        userId,
      },
    });
    res.status(202).json({
      message: "succesfully left group chat!",
      success: true,
    });
    return;
    // once done emit to everyone in the chat!
  } catch (err) {
    next(err);
  }
};
/**
 * @method PATCH
 * @description makes a member an admin
 * @param req
 * @param res
 * @route /api/v1/chats/:chatId/make-admin
 */
const makeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { adminId, targetUserId } = req.body;
    const { chatId } = req.params;
    const isUser1Admin = await checkIfAdminOrOwner(adminId, chatId);
    if (!isUser1Admin) {
      res.status(400).json({
        success: false,
        message:
          "you cannot make this user an admin!\nbecome an admin first\nconsider asking your owner or another admin.",
      });
    }
    const isTargetUserAdmin = await checkIfAdminOrOwner(targetUserId, chatId);
    if (isTargetUserAdmin) {
      res.status(400).json({
        message: "user already an admin!",
        success: false,
      });
      return;
    }
    const member = await prisma.member.update({
      where: {
        chatId,
        userId: targetUserId,
      },
      data: {
        role: "ADMIN",
      },
      include: {
        user: {
          select: {
            avatar: true,
            lastSeen: true,
            username: true,
          },
        },
      },
    });
    res.status(200).json({
      message: "successfully made the member an admin!",
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
  getChatDetails,
  getChatMessages,
  joinViaLink,
  editChat,
  addMembers,
  leaveChat,
  deleteGroupChat,
  createDmChat,
  joinPublicGroupChat,
  createGroupChat,
  makeAdmin,
  markAsRead,
};
