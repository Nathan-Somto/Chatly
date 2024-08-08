import { Router } from "express";
import {
  addMembers, 
  editGroupChat,
  getGroupChatMembers,
  getChatMessages,
  joinViaLink,
  leaveChat,
  createDmChat,
  createGroupChat,
  joinPublicGroupChat,
  deleteGroupChat,
   changeRole,
  markAsRead,
  removeMember
} from "../controllers/chats.controllers";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";

const router = Router();

router.use(ClerkExpressRequireAuth());
/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Public, Private Group chats and Direct Message Chats
 */
/**
 * @swagger
 * /chats/{chatId}/messages:
 *   get:
 *     summary: Get messages under a specific chat
 *     description: Retrieves messages for a specific chat with pagination.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of messages per page.
 *     responses:
 *       200:
 *         description: Successfully retrieved chat messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "chat's messages"
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       body:
 *                         type: string
 *                       resourceUrl:
 *                         type: string
 *                       type:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       Sender:
 *                         type: object
 *                         properties:
 *                           avatar:
 *                             type: string
 *                           username:
 *                             type: string
 *                           id:
 *                             type: string
 *                       ParentMessage:
 *                         type: object
 *                         properties:
 *                           avatar:
 *                             type: string
 *                           username:
 *                             type: string
 *                           body:
 *                             type: string
 *                 pages:
 *                   type: integer
 *                   example: 1
 *                 pageSize:
 *                   type: integer
 *                   example: 10
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid pagination parameters.
 *       404:
 *         description: Chat not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:chatId/messages", getChatMessages);
/**
 * @swagger
 * /chats/{chatId}/members:
 *   get:
 *     summary: Get the members of a specific chat
 *     description: Retrieves members for a specific group chat.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat.
 *     responses:
 *       200:
 *         description: Successfully retrieved group chat members.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "retrieved group chat members"
 *                 chatMembers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       lastSeen:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: Group chat not found.
 *       500:
 *         description: Internal server error.
 */

router.get("/:chatId/members", getGroupChatMembers);
/**
 * @swagger
 * /chats/create-dm:
 *   post:
 *     summary: Create a direct message chat
 *     description: Creates a private message chat between two users.
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *     responses:
 *       201:
 *         description: Successfully created direct message chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully created private message"
 *                 privateChat:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     privacy:
 *                       type: string
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                           avatar:
 *                             type: string
 *                           lastSeen:
 *                             type: string
 *                             format: date-time
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid data provided for creating the direct message chat.
 *       500:
 *         description: Internal server error.
 */
router.post("/create-dm", createDmChat);
/**
 * @swagger
 * /chats/create-groupchat:
 *   post:
 *     summary: Create a group chat
 *     description: Creates a private or public group chat.
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               members:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     value:
 *                       type: string
 *                     isOwner:
 *                       type: boolean
 *               privacy:
 *                 type: string
 *                 enum: [PUBLIC, PRIVATE]
 *               ownerName:
 *                 type: string
 *               ownerId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully created group chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully created group chat!"
 *                 groupChat:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     privacy:
 *                       type: string
 *                     avatars:
 *                       type: array
 *                       items:
 *                         type: string
 *                     members:
 *                       type: array
 *                       items:
 *                         type: string
 *                 firstMessage:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     body:
 *                       type: string
 *                     chatId:
 *                       type: string
 *                     senderId:
 *                       type: string
 *                     type:
 *                       type: string
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid data provided for creating the group chat.
 *       500:
 *         description: Internal server error.
 */

router.post("/create-groupchat", createGroupChat);
/**
 * @swagger
 * /chats/{chatId}/join-via-link:
 *   post:
 *     summary: Join a chat via invite link
 *     description: Allows a user to join a public or private group chat using an invite link.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat.
 *     responses:
 *       200:
 *         description: Successfully joined the chat via invite link.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully joined the chat via link"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Chat not found or invalid link.
 *       500:
 *         description: Internal server error.
 */
router.post("/:chatId/join-via-link", joinViaLink);
/**
 * @swagger
 * /api/v1/chats/{chatId}/join:
 *   post:
 *     summary: Join a public group chat
 *     description: Allows a user to join a public group chat.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully added user to group chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully added user to group chat!"
 *                 groupChat:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     privacy:
 *                       type: string
 *                     avatars:
 *                       type: array
 *                       items:
 *                         type: string
 *                     members:
 *                       type: array
 *                       items:
 *                         type: string
 *                 joinedMessage:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     body:
 *                       type: string
 *                     chatId:
 *                       type: string
 *                     senderId:
 *                       type: string
 *                     type:
 *                       type: string
 *       400:
 *         description: User is already in the group chat.
 *       404:
 *         description: Group chat does not exist.
 *       500:
 *         description: Internal server error.
 */
router.post("/:chatId/join", joinPublicGroupChat);
/**
 * @swagger
 * /chats/{chatId}/mark-as-read:
 *   patch:
 *     summary: Mark messages as read
 *     description: Marks a user's chat messages as read.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               messageId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully marked message as read.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     body:
 *                       type: string
 *                     chatId:
 *                       type: string
 *                     senderId:
 *                       type: string
 *                     type:
 *                       type: string
 *                     resourceUrl:
 *                       type: string
 *                     parentMessageId:
 *                       type: string
 *                     isEditted:
 *                       type: boolean
 *                     readByIds:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "successfully read message!"
 *       400:
 *         description: Invalid data provided for marking message as read.
 *       500:
 *         description: Internal server error.
 */

router.patch("/:chatId/mark-as-read", markAsRead)
/**
 * @swagger
 * /api/v1/chats/{chatId}:
 *   patch:
 *     summary: Edit group chat details
 *     description: Edits certain descriptive elements of group chats. Only admin/owner members have rights.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               privacy:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated group chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully updated group chat"
 *                 updatedGroupChat:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     privacy:
 *                       type: string
 *       400:
 *         description: User does not have administrative access.
 *       500:
 *         description: Internal server error.
 */

router.patch("/:chatId", editGroupChat);
/**
 * @swagger
 * /api/v1/chats/{chatId}/add-members:
 *   patch:
 *     summary: Add members to group chat
 *     description: Adds members to group chats, accepts an array of members.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully added user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully added user"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Member already added.
 *       500:
 *         description: Internal server error.
 */
router.patch("/:chatId/add-members", addMembers);
/**
 * @swagger
 * /api/v1/chats/{chatId}/remove-member:
 *   patch:
 *     summary: Removes a member from a group chat
 *     description: Endpoint to remove a member from a group chat. Requires the user to be an admin or owner of the chat.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the chat from which the member is to be removed.
 *       - in: body
 *         name: body
 *         description: The request body to remove a member from a group chat.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             adminUsername:
 *               type: string
 *               description: Username of the admin performing the removal.
 *             userId:
 *               type: string
 *               description: ID of the admin performing the removal.
 *             targetUserId:
 *               type: string
 *               description: ID of the member to be removed.
 *             targetUsername:
 *               type: string
 *               description: Username of the member to be removed.
 *     responses:
 *       200:
 *         description: Successfully removed member from the group chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully removed member"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 removedMessage:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the system message created.
 *                     chatId:
 *                       type: string
 *                       description: ID of the chat.
 *                     body:
 *                       type: string
 *                       description: Body of the system message.
 *                     senderId:
 *                       type: string
 *                       description: ID of the sender (admin).
 *                     type:
 *                       type: string
 *                       description: Type of the message (SYSTEM).
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp of the message creation.
 *       400:
 *         description: Bad request. Possible reasons - user is not an admin or owner, member not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user is not an admin or owner"
 *                 success:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 success:
 *                   type: boolean
 *                   example: false
 */
router.patch("/:chatId/remove-member", removeMember);
/**
 * @swagger
 * /api/v1/chats/{chatId}/leave:
 *   patch:
 *     summary: Leave group chat
 *     description: Allows a user to leave a group chat. Requires userId in body.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: Successfully left group chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully left group chat!"
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 joinedMessage:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     body:
 *                       type: string
 *                     chatId:
 *                       type: string
 *                     senderId:
 *                       type: string
 *                     type:
 *                       type: string
 *       400:
 *         description: User has left or this is not a group chat.
 *       500:
 *         description: Internal server error.
 */
router.patch("/:chatId/leave", leaveChat);
/**
 * @swagger
 * /api/v1/chats/{chatId}/change-role:
 *   patch:
 *     summary: Makes a user an admin or member.
 *     description: Makes a user an admin or member.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the chat.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               adminId:
 *                 type: string
 *               targetUserId:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [MEMBER, ADMIN]
 *     responses:
 *       200:
 *         description: Successfully made the member an admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully made the member an admin!"
 *                 member:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     chatId:
 *                       type: string
 *                     role:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         avatar:
 *                           type: string
 *                         lastSeen:
 *                           type: string
 *                           format: date-time
 *                         username:
 *                           type: string
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: User cannot make this user an admin or user is already an admin.
 *       500:
 *         description: Internal server error.
 */
router.patch("/:chatId/change-role", changeRole);
/**
 * @swagger
 * /api/v1/chats/{chatId}/group-chat:
 *   delete:
 *     summary: Delete a group chat
 *     description: Deletes a particular group chat. Requires the user to be an admin or owner.
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the chat.
 *     responses:
 *       202:
 *         description: Successfully deleted group chat.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully deleted group chat!"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: User is not an admin or owner, or group chat does not exist.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "user is not an admin or owner"
 *                 success:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Internal server error.
 */
router.delete("/:chatId/group-chat", deleteGroupChat);

export default router;
