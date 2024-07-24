import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/connectDb";
/**
 * @method POST
 * @description creates a message which could be audio | text | video | image
 * @param req
 * @param res
 * @route /api/v1/messages/
 */
const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, body, chatId, type, resourceUrl, parentMessageId } = req.body;
    const message = await prisma.message.create({
      data: {
        body,
        chatId,
        senderId: userId,
        type: type ?? "TEXT",
        resourceUrl: resourceUrl ?? "",
        parentMessageId: parentMessageId ?? null
      },
      include: {
        Sender: {
          select: {
            avatar: true,
            username: true,
            id: true,
          },
        },
      },
    });
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastSeen: new Date(),
      },
    });
    return res
      .status(201)
      .json({
        message: "successfully created message",
        data: message,
        success: true,
      });
  } catch (err) {
    next(err);
  }
};
/**
 * @method PUT
 * @description edits only the content of a message
 * @param req
 * @param res
 * @route /api/v1/messages/:messageId
 */
const editMessage = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const {userId,body} = req.body;
        const {messageId} = req.params;
        const clerkId = req.auth.userId;
       const foundMessage = await prisma.message.findUnique({
            where : {
                id: messageId,
                senderId : userId
            },
            include : {
                Sender : {
                    select : {
                        clerkId:true
                    }
                }
            }
        });
        if(foundMessage === null){
            res.status(404).json({
                message : "could not find message",
                success: false
            });
            return;
        }
        if(foundMessage.Sender.clerkId !== clerkId){
            res.status(401).json({
                message: "cannot edit another person's message",
                success: false
            });
            return;
        }
        const updatedBody = body || foundMessage.body;
        const updatedMessage = await prisma.message.update({
          where: { id: messageId},
          data: {
            body: updatedBody,
            isEditted: true
          },
          include: {
            Sender: {
              select: {
                avatar: true,
                username: true,
                id: true,
              },
            },
          },
        });
        await prisma.user.update({
            where: {id: userId},
            data: {
                lastSeen : new Date()
            }
        });
        res.status(200).json({
            message: "succesfully editted message",
            data:updatedMessage,
            success:true
        });
        return;
    }catch(err){
        next(err)
    }
};
/**
 * @method DELETE
 * @description deletes a given message for a particular user.
 * @route /api/v1/messages/:messageId
 */
const deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {messageId} = req.params;
        const clerkId = req.auth.userId;
        const isMyMessage = await prisma.user.findFirst({
            where :{
                clerkId,
                Message : {
                    some : {
                        id: messageId
                    }
                }
            },
            select: {
                id: true,
                clerkId:true
            }
        });
        if(isMyMessage === null){
            res.status(401).json({
                message : "this is not your message!",
                success: false
            });
            return;
        }
        await prisma.message.delete({
            where : {
                id: messageId
            }
        })
        await prisma.user.update({
            where: {id: isMyMessage.id},
            data: {
                lastSeen : new Date()
            }
        });
        res.status(200).json({
            message : "successfully deleted user's message",
            success: true
        })
    }
    catch(err){
        next(err)
    }
};
export { createMessage, editMessage, deleteMessage };
