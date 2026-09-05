import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    // User who made the reservation
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Restaurant being booked
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    // Reservation date
    date: {
      type: String,
      required: true,
    },

    // Reservation time
    time: {
      type: String,
      required: true,
    },

    // Number of guests
    partySize: {
      type: Number,
      required: true,
      min: 1,
    },

    // Reservation status
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed", "no_show"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  },
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
