import { Express } from "express";
import searchRouter from "../routes/search.routes";
import userRouter from "../routes/user.routes";
import messageRouter from "../routes/message.routes";
import chatRouter from "../routes/chat.routes";
import swaggerJSDoc from "swagger-jsdoc";
import { swaggerOptions } from "../swagger";
import swaggerUi from "swagger-ui-express";
import { cloudinaryService } from "../services/cloudinary";
import { version } from "../../package.json";
import { livekitService } from "../services/liveKit";
import { joinViaLink } from "../controllers/chats.controllers";
export function router(app: Express) {
  const apiPrefix = `api/v${version.split(".")[0]}/`;
  console.log("apiPrefix", apiPrefix);
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
