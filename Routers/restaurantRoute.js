import express from "express";
import {
  createRestaurant,
  updateRestaurant,
  getAllRestaurants,
  getRestaurant,
  deleteRestaurant,
} from "../Controllers/restaurantController.js";
import { authMiddleware, ownerOrAdmin } from "../Middlewares/middleware.js";

const router = express.Router();

router.post("/create", authMiddleware, ownerOrAdmin, createRestaurant);
router.put("/update/:id", authMiddleware, ownerOrAdmin, updateRestaurant);
router.get("/", getAllRestaurants);
router.get("/:id", getRestaurant);
router.delete("/delete/:id", authMiddleware, ownerOrAdmin, deleteRestaurant);

export default router;
