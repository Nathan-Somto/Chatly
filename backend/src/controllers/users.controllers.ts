import { Response, Request, NextFunction } from "express";
import { prisma } from "../config/connectDb";
import clerkClient from "@clerk/clerk-sdk-node";
/**
 * @method GET
 * @description gets a given user profile
 * @route /api/v1/users/profile
 */
const getProfile = async (req: Request, res: Response, next:NextFunction) => {
  try {
    //const { userId } = req.params;
    console.log("executing")
    const clerkId = req.auth.userId;
    console.log("clerkId", clerkId);
    const foundUser = await prisma.user.findUnique({
      where: {
        clerkId
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
      return res.status(200).json({
        message: "profile does not exist",
        success: false,
        user: null
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
 * @route /api/v1/users?memberInfo=true
 */
const getUsers = async(req:Request, res:Response, next:NextFunction) => {
  try{
    const clerkId = req.auth.userId;
    const {memberInfo} = req.query;
    const users = await prisma.user.findMany({
      where : {
        NOT : {
          clerkId
        }
      },
      select: {
        username: true,
        id: true,
        lastSeen: true,
        avatar: true,
      }
    });
    let formattedMemberInfo;
    if(memberInfo) {
      formattedMemberInfo = users.map((user) => {
        return {
          username: user.username,
          id: user.id
        }
      })
    }
   return res.status(200).json({
      success: true,
      message: "succesfully retrieved users",
      users: memberInfo ? formattedMemberInfo : users
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
    const clerkId = req.auth.userId;
    const user = await prisma.user.findUnique({
      where: {
        clerkId,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "user not found!",
      });
    }
    const userId = user.id;
   const chats = await prisma.chat.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      select: {
        id: true,
        isGroup: true,
        name: true,
        description: true,
        inviteCode: true,
        privacy: true,
        members: {
          take: 3,
          select: {
            user: {
              select:{
                avatar: true,
                username: true,
                lastSeen: true,
                id: true,
                bio: true,
                email: true
              }
            }
          },
        },
        message: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
          select: {
            body: true,
            createdAt: true,
            readByIds: true,
            type: true,
            senderId: true,
          },
        },
      }
    });
    // if it is not a group chat get the member and username avatras that do not belong to the requesting user
    const formattedChats = chats.map((chat) => {
      let members = chat.members;
      let name = chat.name;
      let lastSeen = new Date();
      let email,bio;
      if(!chat.isGroup){
        members = chat.members.filter((member) => member.user.id !== userId);
        name = members.length > 0 ? members[0].user.username : "Chatly User";
        lastSeen = members[0].user.lastSeen;
        email = members[0].user.email;
        bio = members[0].user.bio;
      }
    return  {
        id: chat.id,
        isGroup: chat.isGroup,
        name,
        message: chat.message[0] ?? { 
            createdAt: new Date(),
            body: null,
            type:'TEXT',
            readByIds:[],
            senderId: null
        },
        avatars: members.map((member) => member.user.avatar),
        members: members.map(member => member.user.username),
        lastSeen,
        email,
        bio,
        inviteCode: chat?.inviteCode ?? null,
        description: chat.description,
        privacy: chat.privacy
      };
     
    });
    console.log(JSON.stringify(formattedChats))
    return res.status(200).json({
      success: true,
      chats: formattedChats,
      message: "successfully retrieved user's chats",
    });
  } catch (err) {
    next(err);
  }
};
/**
 * @method POST
 * @param req
 * @param res
 * @route /api/v1/users
 * @description creates a user after they have signed up, the client uses clerk for authentication.
 */
const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, bio, avatar} = req.body;
    const clerkId = req.auth.userId;
    console.log(JSON.stringify({
      username,
      email,
      bio,
      isOnboarded: true,
      avatar,
      clerkId,
    }))
   
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
        avatar: avatar ?? null,
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
 * @method PATCH
 * @description updates a given user's profile.
 * @route /api/v1/users
 * @param req
 * @param res
 */
const updateProfile = async (req: Request, res: Response, next:NextFunction) => {
  try {
    console.log("executing route handler!")
    const clerkId = req.auth.userId;
    const { username, bio, avatar } = req.body;
    console.log(JSON.stringify(req.body))
    const foundUser = await prisma.user.findUnique({
      where: {
        clerkId,
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
    const updatedUsername = username || foundUser.username;
    const updatedBio = bio || foundUser.bio;
    const updatedAvatar = avatar || foundUser.avatar;
  const updatedProfile =  await prisma.user.update({
      where: {
        clerkId
      },
      data: {
        avatar: updatedAvatar,
        username: updatedUsername,
        bio: updatedBio,
        isOnboarded: true
      },
    });
    return res.status(200).json({
      message: "succesfully updated user's profile",
      user: updatedProfile,
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
