import "dotenv/config";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import cors from "cors";
import userRouter from "./routes/user.routes";
import chatRouter from "./routes/chat.routes";
import messageRouter from "./routes/message.routes";
import searchRouter from "./routes/search.routes";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler";
import { upload } from "./controllers/upload.controllers";
import { Server } from "socket.io";
import { createServer } from "http";
import { updateOnlineStatus } from "./utils/updateOnlineStatus";
import { MessageDeleteEmit, MessageEmit } from "./types";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "./swaggerOptions";
import swaggerUi from "swagger-ui-express";
import { getReqUrl } from "./utils/getReqUrl";
const app = express();
// create a http server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? false
        : [
            "http://localhost:5173",
            "https://charming-griffon-54.clerk.accounts.dev",
          ],
  },
  pingInterval: 28000,
  maxHttpBufferSize: 1.5e6,
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://charming-griffon-54.clerk.accounts.dev",
    ],
  })
);
app.use(express.json());
app.use(
  fileUpload({
    tempFileDir: "./tmp",
    limits: {
      fileSize: 70 * 1024 * 1024,
    },
  })
);
app.use(morgan("dev"));
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
app.post("/api/v1/upload", upload);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);
app.use(errorHandler);
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  // updates the user's online status.
  socket.on("userConnected", async (userId: string) => {
    await updateOnlineStatus(userId);
    console.log("Users online status updated:", userId);
  });
  // for joining a partcular room (direct message or group chat)
  socket.on("joinChat", ({ chatId, userId }) => {
    socket.join(chatId);
    console.log(`user ${userId} joined the chat ${chatId}`);
  });
  // for leaving a particular room (direct message or group chat)
  socket.on("leaveChat", ({ chatId, userId }) => {
    socket.leave(chatId);
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
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      message: `welcome to chatly's api, preview the docs at:\n${getReqUrl(
        req
      )}api/docs`,
    });
  });
}

export default httpServer;
