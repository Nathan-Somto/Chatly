import { Router } from "express";
import {
  addMembers, 
  editChat,
  getChatDetails,
  getChatMessages,
  joinViaLink,
  leaveChat,
  createDmChat,
  createGroupChat,
  joinPublicGroupChat,
  deleteGroupChat,
  makeAdmin,
  markAsRead
} from "../controllers/chats.controllers";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.use(ClerkExpressRequireAuth);

router.get("/:chatId/messages", getChatMessages);
router.get("/:chatId", getChatDetails);
router.post("/create-dm", createDmChat);
router.post("/create-groupchat", createGroupChat)
router.post("/:chatId/join-via-link", joinViaLink);
router.post("/:chatId/join", joinPublicGroupChat);
router.patch("/:chatId/mark-as-read", markAsRead)
router.patch("/:chatId", editChat);
router.patch("/:chatId/add-members", addMembers);
router.patch("/:chatId/leave", leaveChat);
router.patch("/:chatId/make-admin", makeAdmin);
router.delete("/:chatId/group-chat", deleteGroupChat);

export default router;
