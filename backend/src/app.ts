import 'dotenv/config';
import express, { NextFunction, Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import cors from "cors";
import userRouter from "./routes/user.routes";
import chatRouter from "./routes/chat.routes";
import messageRouter from "./routes/message.routes";
import searchRouter from "./routes/search.routes";
import fileUpload from "express-fileupload";
import { errorHandler } from "./middlewares/errorHandler";
import { upload } from './controllers/upload.controllers';
console.log("client secret", process.env.CLERK_SECRET_KEY);
const app = express();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use(
  cors({
    origin: "http://localhost:5173",
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
app.post('/api/v1/upload', upload);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);
app.use("api/v1/search", searchRouter);
app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "frontend", "build")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "welcome to chatly's api" });
  });
}

export default app;
