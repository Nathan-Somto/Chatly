import { prisma } from "../config/connectDb";

export async function createSystemMessage({
  userId,
  message,
  chatId,
}: {
  userId: string;
  message: string;
  chatId: string;
}) {
  return await prisma.message.create({
    data: {
      chatId,
      senderId: userId,
      body: message,
      type: "SYSTEM",
    },
  });
}
