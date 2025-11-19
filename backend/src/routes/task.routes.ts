import { Router } from "express";
import * as TaskController from "../controllers/task.controller";
import { jwtMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               project_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *               due_date:
 *                 type: string
 *                 format: date
 *               assignedIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post("/tasks", jwtMiddleware, TaskController.createTask);

router.get("/tasks", jwtMiddleware, TaskController.getAllTasks);

router.get("/tasks/:id", jwtMiddleware, TaskController.getTaskById);

router.put("/tasks/:id", jwtMiddleware, TaskController.updateTask);

router.delete("/tasks/:id", jwtMiddleware, TaskController.deleteTask);

export default router;
