// backend/routes/bookings.js

const express = require("express");
const router = express.Router();
const { confirmBooking, getBookingByTrip, resendEmail } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/confirm", protect, confirmBooking);                    // POST   /api/bookings/confirm
router.get("/:tripId", protect, getBookingByTrip);                  // GET    /api/bookings/:tripId
router.post("/:tripId/resend-email", protect, resendEmail);         // POST   /api/bookings/:tripId/resend-email

module.exports = router;