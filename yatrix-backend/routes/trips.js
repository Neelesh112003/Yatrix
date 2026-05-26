

const express = require("express");
const router = express.Router();
const {
  createTrip,
  getUserTrips,
  getTripById,
  updateItinerary,
  regenerateItinerary,
  deleteTrip,
} = require("../controllers/tripController");
const { protect } = require("../middleware/authMiddleware");

// All routes are protected
router.post("/", protect, createTrip);                          // POST   /api/trips
router.get("/", protect, getUserTrips);                         // GET    /api/trips
router.get("/:id", protect, getTripById);                       // GET    /api/trips/:id
router.put("/:id/itinerary", protect, updateItinerary);         // PUT    /api/trips/:id/itinerary
router.post("/:id/regenerate", protect, regenerateItinerary);   // POST   /api/trips/:id/regenerate
router.delete("/:id", protect, deleteTrip);                     // DELETE /api/trips/:id

module.exports = router;