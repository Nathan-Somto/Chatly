import "dotenv/config";
import express from "express";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import cors from "cors";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { getReqUrl } from "./utils/getReqUrl.js";
import { router } from "./router/index.js";
import { socketIo } from "./socket-io/index.js";
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

router(app);
app.use(errorHandler);
socketIo(io);
if (process.env.NODE_ENV === "production" ) {
  app.use(express.static(path.join(__dirname, "public", "dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "public", "dist", "index.html"));
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
