import { prisma } from "../config/connectDb";

export async function updateOnlineStatus(userId: string){
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            lastSeen: new Date()
        }
    })
}