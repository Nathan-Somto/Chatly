import { Response, Request, NextFunction } from "express";
import { prisma } from "../config/connectDb";
import { uploadFile } from "../utils/uploadFile";
import clerkClient from "@clerk/clerk-sdk-node";
/**
 * @method GET
 * @description gets a given user profile
 * @route /api/v1/users/:userId
 */
const getProfile = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { userId } = req.params;
    const clerkId = req.auth.userId;
    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        username: true,
        email: true,
        bio: true,
        isOnboarded: true,
        avatar: true,
        clerkId: true,
        id: true,
      },
    });
    if (!foundUser) {
      return res.status(400).json({
        message: "profile does not exist",
        success: false
      });     
    }
    if (foundUser.clerkId !== clerkId) {
      res.status(400).json({
        message: "cannot access another user's profile",
        success: false
      });
      return;
    }
    return res.status(200).json({
      success: true,
      message: "retrieved logged in user's profile",
      user: foundUser,
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method GET
 * @description gets user's in the db! apart from logged in use
 * @route /api/v1/users/
 */
const getUsers = async(req:Request, res:Response, next:NextFunction) => {
  try{
    const clerkId = req.auth.userId;
    const users = await prisma.user.findMany({
      where : {
        NOT : {
          clerkId
        }
      }
    });
   return res.status(200).json({
      success: true,
      message: "succesfully retrieved users",
      users
    })
  }
  catch(err){
    next(err);
  }
}
/**
 * @method GET
 * @description get all the chats for a given user where only the first message is populated.
 * @route /api/v1/users/:userId/chats
 */
const getUserChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    // handle getting member data for private message display
   const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          take: 3,
          where : {
            userId : {
              not: userId 
            }
          },
          select: {
            user: true
          },
          include : {
            user: {
              select : {
                avatar : true,
                username: true
              }
            }
          }
        },
        message: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            body: true,
            createdAt: true,
          },
          include: {
            readBy: {
              select: {
                userId: true,
              },
            },
          },
        },
      }
    });
    //console.log(chats[0].)
    return res.status(200).json({
      success: true,
      chats,
      message: "successfully got user's chats",
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method POST
 * @param req
 * @param res
 * @route /api/v1/users/create
 * @description creates a user after they have signed up, the client uses clerk for authentication.
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, bio, avatar: bodyAvatarUrl } = req.body;
    const clerkId = req.auth.userId;
    let avatar = "";
    if (!bodyAvatarUrl) {
      if (req?.files?.avatar) {
        const url = await uploadFile(req.files.avatar as unknown as string);
        avatar = url;
      }
    } else {
      avatar = bodyAvatarUrl;
    }
    const isUsernameTaken = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
      },
    });
    if (isUsernameTaken)
      res.status(400).json({
        username,
        message: "username already taken!",
      });
    const createdUser = await prisma.user.create({
      data: {
        username,
        email,
        bio,
        isOnboarded: true,
        avatar,
        clerkId,
      },
      select: {
        username: true,
        email: true,
        bio: true,
        isOnboarded: true,
        avatar: true,
        clerkId: true,
      },
    });
    res.status(201).json({
      success: true,
      message: "successfully created user",
      user: createdUser,
    });
  } catch (err) {
   next(err)
  }
};
/**
 * @method PUT
 * @description updates a given user's profile.
 * @route /api/v1/users/:userId
 * @param req
 * @param res
 */
const updateProfile = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const { userId } = req.params;
    const clerkId = req.auth.userId;
    const { username, bio } = req.body;
    const foundUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        username: true,
        bio: true,
        avatar: true,
        clerkId: true,
      },
    });
    if (!foundUser) {
      
      return res.status(404).json({
        message: "user not found!",
        success: false
      });
    }
    if (foundUser.clerkId !== clerkId) {
     return res.status(400).json({
        message: "cannot update another user's profile!",
        success: false
      });
     
    }
    let avatar = "";
    if (req?.files?.avatar) {
        const url = await uploadFile(req.files.avatar as unknown as string);
        avatar = url;
    }
    const updatedUsername = username || foundUser.username;
    const updatedBio = bio || foundUser.bio;
    let updatedAvatar = avatar || foundUser.avatar;
  const updatedProfile =  await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        avatar: updatedAvatar,
        username: updatedUsername,
        bio: updatedBio,
      },
    });
    return res.status(200).json({
      message: "succesfully updated user's profile",
      profile: updatedProfile,
      success: true
    })
  } catch (err) {
    next(err);
  }
};
/**
 * @method DELETE
 * @param req 
 * @param res
 * @description deletes a the logged in users account!
 * @route /api/v1/users 
 */
const deleteUser = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const clerkId = req.auth.userId;
    await prisma.user.delete({
      where : {
        clerkId
      }
    });
    await clerkClient.users.deleteUser(clerkId);
    return res.status(200).json({
      message: "succesfully deleted user",
      success: true,
      user: null
    })
  }
  catch(err){
  next(err)
  }
}
export { getProfile, getUserChats, createUser, updateProfile,getUsers, deleteUser };
