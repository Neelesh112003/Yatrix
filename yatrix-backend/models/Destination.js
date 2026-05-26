

const mongoose = require("mongoose");

const subDestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  distanceFromCity: { type: String, default: "" },
  type: { type: String, default: "" },
  entryFee: { type: Number, default: 0 },
  timingHours: { type: String, default: "" },
  imageUrl: { type: String, default: "" },
});

const destinationSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      unique: true,
      enum: ["Delhi", "Jaipur", "Chandigarh", "Jabalpur"],
    },
    state: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: "" },
    popular: { type: Boolean, default: true },
    avgCostPerDay: { type: Number, required: true },
    bestTimeToVisit: { type: String, default: "" },
    tags: { type: [String], default: [] },
    subDestinations: [subDestinationSchema],
  },
  { timestamps: true }
);

const Destination = mongoose.model("Destination", destinationSchema);
module.exports = Destination;