import { Router } from "express";
import {
  createMessage,
  deleteMessage,
  editMessage,
} from "../controllers/messages.controllers.js";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
const router = Router();

router.use(ClerkExpressRequireAuth());
/**
 * @swagger
 * tags:
 *   name: Message
 *   description: Message management
 */
/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Create a message
 *     description: Creates a message which could be audio, text, video, or image.
 *     tags: [Message]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user sending the message.
 *               body:
 *                 type: string
 *                 description: Content of the message.
 *               chatId:
 *                 type: string
 *                 description: ID of the chat where the message is sent.
 *               type:
 *                 type: string
 *                 enum: [TEXT, AUDIO, VIDEO, IMAGE]
 *                 description: Type of the message.
 *               resourceUrl:
 *                 type: string
 *                 description: URL for the resource (e.g., audio, video).
 *               parentMessageId:
 *                 type: string
 *                 description: ID of the parent message if this is a reply.
 *     responses:
 *       201:
 *         description: Successfully created message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully created message"
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
 *                     Sender:
 *                       type: object
 *                       properties:
 *                         avatar:
 *                           type: string
 *                         username:
 *                           type: string
 *                         id:
 *                           type: string
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Internal server error.
 */
router.post("/", createMessage);
router
.route("/:messageId")
/**
 * @swagger
 * /messages/{messageId}:
 *   patch:
 *     summary: Edit a message
 *     description: Edits only the content of a message.
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to be edited.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user editing the message.
 *               body:
 *                 type: string
 *                 description: New content of the message.
 *     responses:
 *       200:
 *         description: Successfully edited message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully edited message"
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
 *                     Sender:
 *                       type: object
 *                       properties:
 *                         avatar:
 *                           type: string
 *                         username:
 *                           type: string
 *                         id:
 *                           type: string
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized to edit this message.
 *       404:
 *         description: Message not found.
 *       500:
 *         description: Internal server error.
 */
.patch(editMessage)
/**
 * @swagger
 * /messages/{messageId}:
 *   delete:
 *     summary: Delete a message
 *     description: Deletes a given message for a particular user.
 *     tags: [Message]
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the message to be deleted.
 *     responses:
 *       200:
 *         description: Successfully deleted the message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "successfully deleted user's message"
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized to delete this message.
 *       500:
 *         description: Internal server error.
 */
.delete(deleteMessage);

export default router;
