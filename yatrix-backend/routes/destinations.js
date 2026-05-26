const express = require("express");
const router = express.Router();
const {
  getAllDestinations,
  getDestinationByCity,
  getHotelsByCity,
  getTrainsByCity,
  getTransportByCity,
} = require("../controllers/destinationController");

const { protect } = require("../middleware/authmiddleware");

// All routes protected — user must be logged in
router.get("/", protect, getAllDestinations);                        // GET /api/destinations
router.get("/:city", protect, getDestinationByCity);                // GET /api/destinations/Jaipur
router.get("/:city/hotels", protect, getHotelsByCity);              // GET /api/destinations/Jaipur/hotels
router.get("/:city/trains", protect, getTrainsByCity);              // GET /api/destinations/Jaipur/trains
router.get("/:city/transport", protect, getTransportByCity);        // GET /api/destinations/Jaipur/transport

module.exports = router;