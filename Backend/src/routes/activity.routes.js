import express from "express";
import { getActivityLogs } from "../controllers/activity.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/", getActivityLogs);

export default router;
