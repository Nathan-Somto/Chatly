import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/connectDb";
import { formatUsersResponse } from "../utils/formatUsersResponse";
/**
 * @method GET
 * @param req
 * @param res
 * @route /api/v1/search?keyword=''&usersOnly=true
 * @description  globally searches for users or public group chats based on query.
 *
 */
const search = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = req.auth.userId;
    const { keyword = "", usersOnly = false } = req.query;
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            username: {
              contains: keyword as string,
              mode: "insensitive",
            },
          },
          {
            NOT: {
              clerkId,
            },
          },
        ],
      },
      select: {
        avatar: true,
        lastSeen: true,
        id: true,
        username: true
      }
    });
    let publicGroupChats;
    if (!usersOnly) {
      publicGroupChats = await prisma.chat.findMany({
        where: {
          name: {
            contains: keyword as string,
            mode: "insensitive",
          },
          members: {
            none : {
              user : {
                clerkId
              }
            }
          },
          isGroup: true,
          privacy: "PUBLIC",
          
        },
        select: {
          id: true,
          name: true,
          description: true,
          isGroup: true,
          members: {
            take: 2,
            select: {
              user: {
                select: {
                  avatar: true,
                },
              },
            },
          },
        },
      });
    }
    const formattedGroupChat = publicGroupChats?.map((groupChat) => {
      return {
        ...groupChat,
        avatars: groupChat.members.map((member) => member.user.avatar),
        members: undefined
      };
    });
    const formattedUsers = formatUsersResponse(users);
    return res.status(200).json({
      message: "search results",
      users: formattedUsers,
      groupChats: formattedGroupChat,
      success: true,
    });
  } catch (err) {
    next(err);
  }
};

export { search };
