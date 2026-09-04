import User from "../Models/authModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

//Register a new User || Signup the new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check existing user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Allow only specific role
    const safeRole =
      role === "restaurant_owner" ? "restaurant_owner" : "user";

    // Create user
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashPassword,
      role: safeRole,
    });

    await newUser.save();

    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    return res.status(201).json({
      message: "User Registered Successfully",
      data: userResponse,
    });
  } catch (error) {
    //console.error("Register user error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
