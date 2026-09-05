import express from "express";

import {
  createReservation,
  getAvailability,
  getMyReservations,
  getReservation,
  updateReservation,
  cancelReservation,
  getAllReservations
} from "../Controllers/reservationController.js";
import { authMiddleware, admin } from "../Middlewares/middleware.js";

const router = express.Router();

router.get("/availability", getAvailability);

router.get("/admin/all", authMiddleware, admin, getAllReservations);

router.post("/create", authMiddleware, createReservation);
router.get("/getmydatas", authMiddleware, getMyReservations);
router.put("/update/:id", authMiddleware, updateReservation);
router.delete("/cancel/:id", authMiddleware, cancelReservation);
router.get("/getdata/:id", authMiddleware, getReservation);

export default router;
