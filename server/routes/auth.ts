// server/routes/auth.ts

import express from "express";
import { register, login } from "../controllers/auth";
import { getCurrentUser } from "../controllers/auth";
import { authenticateUser } from "../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateUser, getCurrentUser);

export default router;
