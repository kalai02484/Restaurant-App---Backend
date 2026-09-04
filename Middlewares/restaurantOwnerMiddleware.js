import jwt from "jsonwebtoken";
import User from "../Models/authModel.js";

export const restaurantOwnerMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    // Check role
    if (user.role !== "restaurant_owner") {
      return res.status(403).json({
        message: "Access denied. Restaurant owner only.",
      });
    }

    // Attach user to request
    req.user = user;

    // Continue to controller
    next();
  } catch (error) {
    console.error("Restaurant owner middleware error:", error);

    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }
};
