import express from "express";
import { createRestaurant } from "../Controllers/restaurantController.js";
import { ownerOrAdmin } from "../Middlewares/middleware.js";

const router = express.Router();

router.post("/create" , ownerOrAdmin, createRestaurant);

export default router;