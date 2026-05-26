

const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: {
      type: String,
      required: true,
      enum: ["Delhi", "Jaipur", "Chandigarh", "Jabalpur"],
    },
    pricePerNight: { type: Number, required: true }, // INR
    rating: { type: Number, min: 0, max: 5, default: 3.5 },
    suitability: {
      type: [String],                                // ["Solo", "Family", "Couple"]
      default: ["Solo", "Family"],
    },
    amenities: { type: [String], default: [] },      // ["WiFi", "AC", "Breakfast"]
    address: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Budget", "Mid-range", "Luxury"],
      default: "Mid-range",
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;