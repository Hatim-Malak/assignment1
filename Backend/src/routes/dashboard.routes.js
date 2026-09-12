import express from "express";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);


router.get("/", getDashboardData);

export default router;
