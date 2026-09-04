import User from "../Models/authModel.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

//Register a new User || Signup the new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    //console.log(hashPassword);

    const safeRole = role === "restaurant_owner" ? "restaurant_owner" : "user";

    const newUser = new User({
      name: name.trim(),
      email,
      password: hashPassword,
      role: safeRole,
    });
    await newUser.save();
    res
      .status(200)
      .json({ message: "User Registered Successfully", data: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "User Not Registered Error in register user" });
  }
};
