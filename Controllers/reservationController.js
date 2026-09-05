import mongoose from "mongoose";
import dotenv from "dotenv";
import Reservation from "../Models/reservationModel.js";
import Restaurant from "../Models/restaurantModel.js";

dotenv.config();

const TIME_SLOTS = [
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
];

//Check availability
export const getAvailability = async (req, res) => {
  try {
    const { restaurantId, date, partySize } = req.query;

    if (!restaurantId || !date || !partySize) {
      return res.status(400).json({
        message: "restaurantId, date and partySize are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({
        message: "Invalid restaurant ID.",
      });
    }

    const parsedPartySize = Number(partySize);

    if (!Number.isInteger(parsedPartySize) || parsedPartySize < 1) {
      return res.status(400).json({
        message: "partySize must be a positive whole number.",
      });
    }

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      isActive: true,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    if (parsedPartySize > restaurant.capacity) {
      return res.status(400).json({
        message: "Party size exceeds restaurant capacity.",
      });
    }

    const reservations = await Reservation.find({
      restaurantId,
      date,
      status: {
        $in: ["pending", "confirmed"],
      },
    }).select("time partySize");

    const availability = TIME_SLOTS.map((time) => {
      const reservationsAtTime = reservations.filter(
        (reservation) => reservation.time === time,
      );

      const reservedSeats = reservationsAtTime.reduce(
        (total, reservation) => total + reservation.partySize,
        0,
      );

      const availableSeats = restaurant.capacity - reservedSeats;

      return {
        time,
        availableSeats: Math.max(availableSeats, 0),
        available: availableSeats >= parsedPartySize,
      };
    });

    return res.status(200).json({
      restaurantId,
      date,
      partySize: parsedPartySize,
      capacity: restaurant.capacity,
      slots: availability,
    });
  } catch (error) {
    console.error("Availability error:", error);

    return res.status(500).json({
      message: "Failed to check availability.",
    });
  }
};

//Create Reservation
export const createReservation = async (req, res) => {
  try {
    const { restaurantId, date, time, partySize, specialRequests } = req.body;

    if (!restaurantId || !date || !time || !partySize) {
      return res.status(400).json({
        message: "restaurantId, date, time and partySize are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({
        message: "Invalid restaurant ID.",
      });
    }

    const parsedPartySize = Number(partySize);

    if (!Number.isInteger(parsedPartySize) || parsedPartySize < 1) {
      return res.status(400).json({
        message: "partySize must be a positive whole number.",
      });
    }

    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      isActive: true,
    });

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found.",
      });
    }

    if (parsedPartySize > restaurant.capacity) {
      return res.status(400).json({
        message: "Party size exceeds restaurant capacity.",
      });
    }

    const validTime = TIME_SLOTS.includes(time);

    if (!validTime) {
      return res.status(400).json({
        message: "Invalid reservation time.",
      });
    }

    /*
     * IMPORTANT:
     * Check availability again on the server
     * immediately before creating the reservation.
     */

    const existingReservations = await Reservation.find({
      restaurantId,
      date,
      time,
      status: {
        $in: ["pending", "confirmed"],
      },
    }).select("partySize");

    const reservedSeats = existingReservations.reduce(
      (total, reservation) => total + reservation.partySize,
      0,
    );

    const availableSeats = restaurant.capacity - reservedSeats;

    if (availableSeats < parsedPartySize) {
      return res.status(409).json({
        message: "Not enough availability for this time slot.",
        availableSeats,
      });
    }

    const reservation = new Reservation({
      userId: req.user._id,
      restaurantId,
      date,
      time,
      partySize: parsedPartySize,
      specialRequests: specialRequests || "",
      status: "confirmed",
      paymentStatus: "unpaid",
    });

    await reservation.save();

    return res.status(201).json({
      message: "Reservation created successfully.",
      reservation,
    });
  } catch (error) {
    console.error("Create reservation error:", error);

    return res.status(500).json({
      message: "Failed to create reservation.",
    });
  }
};
