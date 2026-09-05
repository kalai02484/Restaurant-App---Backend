import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/,
    },

    time: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },

    partySize: {
      type: Number,
      required: true,
      min: 1,
      max: 50,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed", "expired"],
      default: "confirmed",
    },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "failed", "refunded"],
      default: "unpaid",
    },

    stripeSessionId: {
      type: String,
      default: "",
    },

    stripePaymentIntentId: {
      type: String,
      default: "",
    },

    paymentExpiresAt: {
      type: Date,
      default: null,
    },

    specialRequests: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

reservationSchema.index({
  restaurantId: 1,
  date: 1,
  time: 1,
  status: 1,
});

reservationSchema.index({
  userId: 1,
  date: 1,
});

reservationSchema.index({
  stripeSessionId: 1,
});

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
