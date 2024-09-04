import { prisma } from "../config/connectDb.js";

export async function updateOnlineStatus(userId: string){
    try{
 await prisma.user.update({
     where: {
         id: userId
     },
     data: {
         lastSeen: new Date()
     }
 })
}
catch(err){
    console.error('[ErrorLog]:', err);
}
    
}