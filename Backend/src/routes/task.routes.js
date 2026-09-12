import express from "express";
import { 
    getAllTasks, 
    getTaskById, 
    createTask, 
    updateTask, 
    updateTaskStatus,
    deleteTask 
} from "../controllers/task.controller.js";
import { authenticateToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "../validators/task.validator.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getAllTasks);
router.get("/:id", getTaskById);

router.post("/", requireRole(['Admin', 'Project Manager']), validate(createTaskSchema), createTask);

router.put("/:id", requireRole(['Admin', 'Project Manager']), validate(updateTaskSchema), updateTask);
router.delete("/:id", requireRole(['Admin', 'Project Manager']), deleteTask);

router.patch("/:id/status", requireRole(['Admin', 'Project Manager', 'Developer']), validate(updateTaskStatusSchema), updateTaskStatus);

export default router;
