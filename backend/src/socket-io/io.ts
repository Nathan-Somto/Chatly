import { Server } from "socket.io";
import { MessageDeleteEmit, MessageEmit } from "../types.js";
import { updateOnlineStatus } from "../utils/updateOnlineStatus.js";
//@ts-ignore
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export function socketIo(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>){
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        // updates the user's online status.
        socket.on("userConnected", async (userId: string) => {
          await updateOnlineStatus(userId);
          console.log("Users online status updated:", userId);
        });
        // for joining a partcular room (direct message or group chat)
        socket.on("joinChat", ({ chatId, userId }: {chatId: string, userId: string}) => {
          socket.join(chatId);
          console.log(`user ${userId} joined the chat ${chatId}`);
        });
        // for leaving a particular room (dm or group chat)
        socket.on("leaveChat", ({ chatId, userId }: {chatId: string, userId: string}) => {
          socket.leave(chatId);
          io.emit("leftChat", { chatId, userId });
          console.log(`user ${userId} left the chat ${chatId}`);
        });
        // for sending a message
        socket.on("sendMessage", async ({ chatInfo, message }: MessageEmit) => {
          // update the sender's online status.
          await updateOnlineStatus(message.senderId);
          // use this to update both the chat list page and chat page.
          io.to(chatInfo.id).emit("newMessage", {
            chatInfo,
            message,
          });
        });
        // for updating a message
        socket.on("updateMessage", async ({ chatInfo, message }: MessageEmit) => {
          await updateOnlineStatus(message.senderId);
          // send the usual info (if it is in the ui of the frontend it is updated)
          io.to(chatInfo.id).emit("messageUpdated", {
            chatInfo,
            message,
          });
        });
        // for deleting a message
        socket.on(
          "deleteMessage",
          async ({
            chatId,
            deletedMessageId,
            prevMessage,
            userId,
          }: MessageDeleteEmit) => {
            console.log(
              "delete message emit: ",
              chatId,
              JSON.stringify(prevMessage, null, 2),
              deletedMessageId
            );
            // update the sender's online status.
            await updateOnlineStatus(userId);
            io.to(chatId).emit("messageDeleted", {
              chatId,
              deletedMessageId,
              prevMessage,
              userId,
            });
          }
        );
        socket.on("disconnect", () => {
          console.log("User disconnected:", socket.id);
        });
      });
}