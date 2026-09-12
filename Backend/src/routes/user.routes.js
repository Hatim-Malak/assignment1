import express from "express";
import { login, refreshToken, logout, getCurrentUser, getAllUsers, createUser } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.post("/logout", logout);
router.get("/me", getCurrentUser);

router.get("/",  getAllUsers);
router.post("/", createUser);

export default router;