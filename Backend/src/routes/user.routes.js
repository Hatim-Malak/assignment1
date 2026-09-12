import express from "express";
import { login, refreshToken, logout, getCurrentUser, getAllUsers, createUser } from "../controllers/user.controller.js";
import { authenticateToken, requireRole } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, createUserSchema } from "../validators/user.validator.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);

router.use(authenticateToken);

router.post("/logout", logout);
router.get("/me", getCurrentUser);

router.get("/", requireRole(['Admin']), getAllUsers);
router.post("/", requireRole(['Admin']), validate(createUserSchema), createUser);

export default router;