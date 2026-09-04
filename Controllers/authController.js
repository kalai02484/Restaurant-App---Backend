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
    const safeRole = role === "restaurant_owner" ? "restaurant_owner" : "user";

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

//Login the user || signin user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Find user
    const userDetail = await User.findOne({
      email: normalizedEmail,
    });

    // Don't reveal whether email exists
    if (!userDetail) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, userDetail.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables.");

      return res.status(500).json({
        message: "Server configuration error.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        _id: userDetail._id,
        role: userDetail.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );

    userDetail.token = token;
    await userDetail.save();

    res.status(200).json({
      message: "User Logged In Successfully",
      token,
      user: {
        _id: userDetail._id,
        name: userDetail.name,
        email: userDetail.email,
        role: userDetail.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

//Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
