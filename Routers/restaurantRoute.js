import express from "express";
import { createRestaurant, updateRestaurant, getAllRestaurants} from "../Controllers/restaurantController.js";
import { authMiddleware, ownerOrAdmin } from "../Middlewares/middleware.js";

const router = express.Router();

router.post("/create" , authMiddleware, ownerOrAdmin, createRestaurant);
router.put("/update/:id", authMiddleware, ownerOrAdmin, updateRestaurant);
router.get("/getallrestaurants", getAllRestaurants);

export default router;