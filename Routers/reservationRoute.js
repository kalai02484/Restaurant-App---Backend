import express from "express";

import { getAvailability } from "../Controllers/reservationController.js";

const router = express.Router();

router.get("/availability", getAvailability);

export default router;
