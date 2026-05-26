

const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      enum: ["Delhi", "Jaipur", "Chandigarh", "Jabalpur"],
    },
    type: {
      type: String,
      enum: ["Private Cab", "Shared Cab", "City Bus", "Auto Rickshaw", "Metro"],
      required: true,
    },
    pricePerDay: { type: Number, required: true },   // INR per day
    comfort: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    suitability: { type: [String], default: ["Solo", "Family"] },
    description: { type: String, default: "" },      // "Best for flexible sightseeing"
  },
  { timestamps: true }
);

const Transport = mongoose.model("Transport", transportSchema);
module.exports = Transport;