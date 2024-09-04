import { Express } from "express";
import searchRouter from "../routes/search.routes.js";
import userRouter from "../routes/user.routes.js";
import messageRouter from "../routes/message.routes.js";
import chatRouter from "../routes/chat.routes.js";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "../swagger/index.js";
import swaggerUi from "swagger-ui-express";
import { cloudinaryService } from "../services/cloudinary.js";
import { livekitService } from "../services/liveKit.js";
import { joinViaLink } from "../controllers/chats.controllers.js";
export function router(app: Express) {
  const swaggerSpec = swaggerJSDoc(swaggerOptions);
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
  );
  app.post(`/api/v1/livekit/token`, livekitService.createToken);
  app.post(`/api/v1/join-via-link`, joinViaLink);
  app.use(`/api/v1/chats`, chatRouter);
  app.post(`/api/v1/upload`, cloudinaryService.upload);
  app.use(`/api/v1/search`, searchRouter);
  app.use(`/api/v1/users`, userRouter);
  app.use(`/api/v1/messages`, messageRouter);
}
