import {NextFunction, Request,Response} from "express"
import { prisma } from "../config/connectDb";
/**
 * @method GET
 * @param req
 * @param res
 * @route /api/v1/search?keyword&userId&page&pageSize
 * @description  globally searches for a user or public group chat based on query.
 * 
 */
const search = async (req: Request, res: Response, next:NextFunction) => {
    try{
        
        const {keyword = "", userId} = req.query;
        if(typeof userId !== 'string'){
            res.status(400).json({
                message: "userId msut be included in the query",
                success: false
            });
            return;
        }
       const users = await prisma.user.findMany({
            where: {
                AND: [{
                username : {
                    contains : keyword as string,
                    mode: 'insensitive'
                }},
                {
                NOT : {
                    id: userId
                }
            }
            ]
            }
        });
     const publicGroupChats = await prisma.chat.findMany({
        where : {
            name: {
                contains: keyword as string,
                mode: "insensitive"
            },
            isGroup : true,
            privacy : "PUBLIC",
            members : {
                none: { userId }
            }
        }
        
     });
     return res.status(200).json({
        message: "search results",
        users,
        groupChats: publicGroupChats,
        userId,
        success: true
     })

    }catch(err){
        next(err);
    }
};

export {search}