

const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },         // "Shatabdi Express"
    trainNumber: { type: String, required: true },  // "12001"
    fromCity: { type: String, required: true },     // departure city
    toCity: { type: String, required: true },       // "Delhi", "Jaipur" etc.
    departureTime: { type: String, required: true },// "06:00 AM"
    arrivalTime: { type: String, required: true },  // "10:30 AM"
    duration: { type: String, required: true },     // "4h 30m"
    classes: [
      {
        className: { type: String },                // "Sleeper", "3AC", "2AC"
        price: { type: Number },                    // price per person in INR
      },
    ],
    daysOfOperation: { type: String, default: "Daily" },
    rating: { type: Number, default: 4.0 },
  },
  { timestamps: true }
);

const Train = mongoose.model("Train", trainSchema);
module.exports = Train;