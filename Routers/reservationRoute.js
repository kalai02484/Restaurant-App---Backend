import express from "express";

import {
  createReservation,
  getAvailability,
  getMyReservations,
  getReservation,
  updateReservation
} from "../Controllers/reservationController.js";
import { authMiddleware } from "../Middlewares/middleware.js";

const router = express.Router();

router.get("/availability", getAvailability);
router.post("/create", authMiddleware, createReservation);
router.get("/getmydatas", authMiddleware, getMyReservations);
router.get("/getdata/:id", authMiddleware, getReservation);
router.put("/update/:id", authMiddleware, updateReservation);

export default router;
