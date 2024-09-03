import { Express } from "express";
import { upload } from "../controllers/upload.controllers";
import searchRouter from "../routes/search.routes";
import userRouter from "../routes/user.routes";
import messageRouter from "../routes/message.routes";
import chatRouter from "../routes/chat.routes";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "../swagger";
import swaggerUi from "swagger-ui-express";
export function router(app: Express) {
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
}
