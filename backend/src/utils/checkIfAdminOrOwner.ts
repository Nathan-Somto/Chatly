import { prisma } from "../config/connectDb";

const checkIfAdminOrOwner = async (userId: string, chatId: string) => {
    const groupchat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        isGroup: true,
      },
      include: {
        members: {
          where: {
            AND: [
              {
                OR: [{ role: "ADMIN" }, { role: "OWNER" }],
              },
              {
                userId,
              },
            ],
          },
        },
      },
    });
    return groupchat?.members.length === 1;
  }

export {
    checkIfAdminOrOwner
}