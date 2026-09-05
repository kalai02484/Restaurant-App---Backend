import express from "express";

import { createReservation, getAvailability } from "../Controllers/reservationController.js";
import { authMiddleware } from "../Middlewares/middleware.js";

const router = express.Router();

router.get("/availability", getAvailability);
router.post("/", authMiddleware, createReservation);

export default router;
