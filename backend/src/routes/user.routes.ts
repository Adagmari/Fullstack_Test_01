import { Router } from 'express';
import { profile } from '../controllers/user.controller';
import { jwtMiddleware } from '../middlewares/auth.middleware';

const router = Router();
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                 user_email:
 *                   type: string
 *                 user_names:
 *                   type: string
 *       401:
 *         description: Unauthorized – invalid or missing token
 */
router.get('/profile', jwtMiddleware, profile);

export default router;
