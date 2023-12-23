import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  editMessage,
} from "../controllers/messages.controllers";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
const router = Router();

router.use(ClerkExpressRequireAuth);
router.post("/", createMessage);
router.route('/:messageId').patch(editMessage).delete(deleteMessage);

export default router;
