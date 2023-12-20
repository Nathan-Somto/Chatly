import { Router } from "express";
import {
  createUser,
  deleteUser,
  getProfile,
  getUserChats,
  getUsers,
  updateProfile,
} from "../controllers/users.controllers";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();
router.use(ClerkExpressRequireAuth);
router.route("/").get(getUsers).patch(updateProfile).delete(deleteUser);
router.get("/:userId", getProfile);
router.get("/:userId/chats", getUserChats);
router.post("/create", createUser);

export default router;
