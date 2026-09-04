import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "restaurant_owner", "user"],
    default: "user",
  },
  token: {
    type: String,
  },
});

const User = mongoose.model("User", authSchema);

export default User;