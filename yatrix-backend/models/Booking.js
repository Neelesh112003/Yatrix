// backend/models/Booking.js

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      unique: true, // one booking per trip
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingReference: {
      type: String,
      required: true,
      unique: true, // e.g. YTX-2026-XXXXX
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    // Snapshot of trip details at booking time
    tripSnapshot: {
      city: String,
      fromCity: String,
      startDate: Date,
      endDate: Date,
      numberOfDays: Number,
      travelers: Number,
      tripType: String,
      selectedTrain: Object,
      selectedHotel: Object,
      selectedTransport: Object,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;