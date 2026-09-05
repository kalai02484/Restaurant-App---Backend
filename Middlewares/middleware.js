import jwt from "jsonwebtoken";
import User from "../Models/authModel.js";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  //method 1
  //const token = req.header("Authorization");
  //method 2 bearer token
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(404).json({ message: "Token Missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("decoded", decoded);
    req.user = await User.findById(decoded._id).select("-password");
    //console.log("req.user", req.user);
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restaurantOwner = async (req, res, next) => {
  if (req.user.role != "restaurant_owner") {
    return res
      .status(404)
      .json({ message: "Access denied. Restaurant access Required" });
  }
  next();
};

export const admin = async (req, res, next) => {
  if (req.user.role != "admin") {
    return res
      .status(404)
      .json({ message: "Access denied. Admin access Required" });
  }
  next();
};


export const ownerOrAdmin = (req, res, next) => {
  if (
    req.user?.role !== "restaurant_owner" &&
    req.user?.role !== "admin"
  ) {
    return res.status(403).json({
      message: "Restaurant Owner or admin access required."
    });
  }

  next();
};