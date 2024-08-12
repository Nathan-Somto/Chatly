import { Router } from "express";
import { search } from "../controllers/search.controller";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
const router = Router();
router.use(ClerkExpressRequireAuth());
/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Group or Users Search
 */
/**
* @swagger
* /search:
*   get:
*     summary: Search for users or public group chats
*     description: Globally searches for users or public group chats based on the query.
*     tags: [Search]
*     parameters:
*       - in: query
*         name: keyword
*         schema:
*           type: string
*         description: The keyword to search for.
*       - in: query
*         name: usersOnly
*         schema:
*           type: boolean
*           default: false
*         description: Flag to search only for users (true) or both users and public group chats (false).
*     responses:
*       200:
*         description: Successfully retrieved search results.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: "search results"
*                 success:
*                   type: boolean
*                   example: true
*                 users:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       id:
*                         type: string
*                         example: "12345"
*                       username:
*                         type: string
*                         example: "username"
*                       avatar:
*                         type: string
*                         example: "https://example.com/avatar.jpg"
*                       lastSeen:
*                         type: string
*                         format: date-time
*                         example: "2023-01-01T00:00:00.000Z"
*                 groupChats:
*                   type: array
*                   items:
*                     type: object
*                     properties:
*                       id:
*                         type: string
*                         example: "67890"
*                       name:
*                         type: string
*                         example: "Group Chat Name"
*                       description:
*                         type: string
*                         example: "Group Chat Description"
*                       avatars:
*                         type: array
*                         items:
*                           type: string
*                           example: "https://example.com/avatar.jpg"
*       500:
*         description: Internal server error.
*/


router.get('/', search);
export default router;