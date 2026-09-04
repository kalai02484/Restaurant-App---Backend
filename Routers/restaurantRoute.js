import express from "express";
import { createRestaurant, updateRestaurant} from "../Controllers/restaurantController.js";
import { authMiddleware, ownerOrAdmin } from "../Middlewares/middleware.js";

const router = express.Router();

router.post("/create" , authMiddleware, ownerOrAdmin, createRestaurant);
router.put("/update/:id", authMiddleware, ownerOrAdmin, updateRestaurant);

export default router;