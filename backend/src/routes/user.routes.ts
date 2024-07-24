import { Router } from "express";
import {
  createUser,
  deleteUser,
  getProfile,
  getUserChats,
  getUsers,
  updateProfile,
} from "../controllers/users.controllers";
import { ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";
const router = Router();
router.use(ClerkExpressRequireAuth())
router.route("/").get(getUsers).patch(updateProfile).delete(deleteUser);
router.get("/profile", getProfile);
router.get("/:userId/chats", getUserChats);
router.post("/", createUser);

export default router;
