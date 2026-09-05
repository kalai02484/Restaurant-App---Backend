import express from "express";

import {
  createReservation,
  getAvailability,
  getMyReservations,
  getReservation,
} from "../Controllers/reservationController.js";
import { authMiddleware } from "../Middlewares/middleware.js";

const router = express.Router();

router.get("/availability", getAvailability);
router.post("/", authMiddleware, createReservation);
router.get("/my", authMiddleware, getMyReservations);
router.get("/:id", authMiddleware, getReservation);

export default router;
