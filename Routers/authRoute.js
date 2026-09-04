import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../Controllers/authController.js";
import { authMiddleware } from "../Middlewares/middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getuser", authMiddleware, getCurrentUser);

export default router;
