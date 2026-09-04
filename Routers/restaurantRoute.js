import express from "express";
import {
  createRestaurant,
  updateRestaurant,
  getAllRestaurants,
  getRestaurant,
} from "../Controllers/restaurantController.js";
import { authMiddleware, ownerOrAdmin } from "../Middlewares/middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, ownerOrAdmin, createRestaurant);
router.put("/update/:id", authMiddleware, ownerOrAdmin, updateRestaurant);
router.get("/restaurants", getAllRestaurants);
router.get("/restaurant/:id", getRestaurant);

export default router;
