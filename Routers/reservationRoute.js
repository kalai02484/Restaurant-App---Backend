import express from "express";

import {
  createReservation,
  getAvailability,
  getMyReservations,
} from "../Controllers/reservationController.js";
import { authMiddleware } from "../Middlewares/middleware.js";

const router = express.Router();

router.get("/availability", getAvailability);
router.post("/", authMiddleware, createReservation);
router.get("/myreservations", authMiddleware, getMyReservations);

export default router;
