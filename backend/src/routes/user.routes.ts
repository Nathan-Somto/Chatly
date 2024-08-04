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
router.use(ClerkExpressRequireAuth());
/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */
router.route("/")
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves all users.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       clerkId:
 *                         type: string
 *                       isOnboarded:
 *                         type: boolean
 *                       avatar:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                 message:
 *                   type: string
 *             examples:
 *               successResponse:
 *                 value:
 *                   success: true
 *                   users:
 *                     - id: "12345"
 *                       username: "username"
 *                       email: "som@gmail.com"
 *                       clerkId: "clerkId"
 *                       isOnboarded: true
 *                       avatar: "https://example.com/avatar.jpg"
 *                       createdAt: "2023-01-01T00:00:00.000Z"
 *                   message: "successfully retrieved users"
 *       500:
 *         description: Internal server error.
 */

.get(getUsers)
/**
 * @swagger
 * /users:
 *   patch:
 *     summary: Update user profile
 *     description: Updates a given user's profile.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                     clerkId:
 *                       type: string
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Cannot update another user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *       500:
 *         description: Internal server error.
 */
.patch(updateProfile)
/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete user
 *     description: Deletes the logged-in user's account.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully deleted user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: null
 *       500:
 *         description: Internal server error.
 */
.delete(deleteUser);
/**
 * @swagger
 * /api/v1/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the profile of the currently authenticated user.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved user's profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "retrieved logged in user's profile"
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     isOnboarded:
 *                       type: boolean
 *                     avatar:
 *                       type: string
 *                     clerkId:
 *                       type: string
 *                     id:
 *                       type: string
 *       400:
 *         description: Cannot access another user's profile.
 *       500:
 *         description: Internal server error.
 */
router.get("/profile", getProfile);
/**
 * @swagger
 * /users/chats:
 * 
 *   get:
 *     summary: Get user's chats
 *     description: Retrieves all the chats for a given user where only the first message is populated.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully retrieved user's chats.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 chats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "12345"
 *                       isGroup:
 *                         type: boolean
 *                         example: false
 *                       name:
 *                         type: string
 *                         example: "Chat Name"
 *                       description:
 *                         type: string
 *                         example: "Chat Description"
 *                       inviteCode:
 *                         type: string
 *                         example: "INVITE123"
 *                       avatars:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "https://example.com/avatar.jpg"
 *                       members:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: "username"
 *                       message:
 *                         type: object
 *                         properties:
 *                           body:
 *                             type: string
 *                             example: "Hello, world!"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2023-01-01T00:00:00.000Z"
 *                           readByIds:
 *                             type: array
 *                             items:
 *                               type: string
 *                               example: "userId"
 *                           type:
 *                             type: string
 *                             example: "TEXT"
 *                       lastSeen:
 *                         type: string
 *                         format: date-time
 *                         example: "2023-01-01T00:00:00.000Z"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
 *                       bio:
 *                         type: string
 *                         example: "User bio"
 *                 message:
 *                   type: string
 *                   example: "successfully retrieved user's chats"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user not found!"
 *       500:
 *         description: Internal server error.
 */
router.get("/chats", getUserChats);
/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create user
 *     description: Creates a user after they have signed up, the client uses Clerk for authentication.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully created user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     email:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     isOnboarded:
 *                       type: boolean
 *                     avatar:
 *                       type: string
 *                     clerkId:
 *                       type: string
 *       400:
 *         description: Username already taken.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error.
 */
router.post("/", createUser);

export default router;
