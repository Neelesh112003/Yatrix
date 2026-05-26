const Trip = require("../models/Trip");
const Destination = require("../models/Destination");
const { generateItinerary } = require("../services/aiService");
const { z } = require("zod");

// ─── Validation schema 

const createTripSchema = z.object({
  city: z.enum(["Delhi", "Jaipur", "Chandigarh", "Jabalpur"]),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().min(500, "Minimum budget is ₹500"),
  travelers: z.number().min(1).max(20),
  tripType: z.enum(["Solo", "Family"]),
  interests: z.array(z.string()).optional(),
  selectedTrain: z.object({}).passthrough().optional(),
  selectedHotel: z.object({}).passthrough().optional(),
  selectedTransport: z.object({}).passthrough().optional(),
});

// ─── CREATE TRIP + GENERATE AI ITINERARY 
// POST /api/trips

const createTrip = async (req, res) => {
  try {
    const validated = createTripSchema.parse(req.body);

    const { city, startDate, endDate, budget, travelers, tripType, interests, selectedTrain, selectedHotel, selectedTransport } = validated;

    // Calculate number of days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;

    // Get destination from DB
    const destination = await Destination.findOne({ city });
    if (!destination) {
      return res.status(404).json({ success: false, message: "City not found" });
    }

    // Calculate estimated cost from selections
    let estimatedCost = 0;
    if (selectedHotel?.pricePerNight) estimatedCost += selectedHotel.pricePerNight * numberOfDays * travelers;
    if (selectedTransport?.pricePerDay) estimatedCost += selectedTransport.pricePerDay * numberOfDays;
    if (selectedTrain) {
      const trainClass = selectedTrain.selectedClass;
      const classData = selectedTrain.classes?.find((c) => c.className === trainClass);
      if (classData) estimatedCost += classData.price * travelers * 2; // to + fro
    }

    // Generate AI itinerary
    let itinerary = [];
    try {
      itinerary = await generateItinerary({
        city,
        days: numberOfDays,
        budget,
        travelers,
        tripType,
        interests: interests || [],
        subDestinations: destination.subDestinations,
      });
    } catch (aiError) {
      console.error("AI generation failed:", aiError.message);
      // Continue without itinerary — user can regenerate later
    }

    // Save trip to DB
    const trip = await Trip.create({
      userId: req.user.id,
      destinationId: destination._id,
      city,
      startDate: start,
      endDate: end,
      numberOfDays,
      budget,
      travelers,
      tripType,
      interests: interests || [],
      selectedTrain: selectedTrain || null,
      selectedHotel: selectedHotel || null,
      selectedTransport: selectedTransport || null,
      itinerary,
      estimatedCost,
      status: "planned",
    });

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip,
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({ success: false, message: error.errors[0].message });
    }
    console.error("createTrip error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── GET ALL TRIPS FOR LOGGED IN USER 
// GET /api/trips

const getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    console.error("getUserTrips error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── GET SINGLE TRIP BY ID 
// GET /api/trips/:id

const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    console.error("getTripById error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── UPDATE ITINERARY (user edits AI output) 
// PUT /api/trips/:id/itinerary

const updateItinerary = async (req, res) => {
  try {
    const { itinerary } = req.body;

    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { itinerary },
      { new: true }
    );

    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    res.status(200).json({ success: true, message: "Itinerary updated", data: trip });
  } catch (error) {
    console.error("updateItinerary error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── REGENERATE ITINERARY 
// POST /api/trips/:id/regenerate

const regenerateItinerary = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const destination = await Destination.findOne({ city: trip.city });

    const itinerary = await generateItinerary({
      city: trip.city,
      days: trip.numberOfDays,
      budget: trip.budget,
      travelers: trip.travelers,
      tripType: trip.tripType,
      interests: trip.interests,
      subDestinations: destination.subDestinations,
    });

    trip.itinerary = itinerary;
    await trip.save();

    res.status(200).json({ success: true, message: "Itinerary regenerated", data: trip });
  } catch (error) {
    console.error("regenerateItinerary error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

// ─── DELETE TRIP 
// DELETE /api/trips/:id

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }
    res.status(200).json({ success: true, message: "Trip deleted" });
  } catch (error) {
    console.error("deleteTrip error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createTrip, getUserTrips, getTripById, updateItinerary, regenerateItinerary, deleteTrip };