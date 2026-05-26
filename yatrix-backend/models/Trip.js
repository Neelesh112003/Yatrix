

const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    destinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
      required: true,
    },
    city: { type: String, required: true },         // "Delhi", "Jaipur" etc.
    fromCity: { type: String, default: "" },  // ← add this if missing
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfDays: { type: Number, required: true },
    budget: { type: Number, required: true },        // total budget in INR
    travelers: { type: Number, default: 1 },
    tripType: {
      type: String,
      enum: ["Solo", "Family"],
      default: "Solo",
    },
    interests: { type: [String], default: [] },

    // Selections made on recommendation page
    selectedTrain: { type: Object, default: null },
    selectedHotel: { type: Object, default: null },
    selectedTransport: { type: Object, default: null },

    // AI generated + user editable itinerary (filled Day 3)
    itinerary: { type: Array, default: [] },

    estimatedCost: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["planned", "confirmed", "completed", "cancelled"],
      default: "planned",
    },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);
module.exports = Trip;