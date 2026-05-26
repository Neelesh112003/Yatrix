// backend/controllers/bookingController.js

const Booking = require("../models/Booking");
const Trip = require("../models/Trip");
const User = require("../models/User");
const { sendBookingConfirmation } = require("../services/emailService");

// ─── Generate unique booking reference ───────────────────────────────────────
const generateBookingRef = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "YTX-";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
};

// ─── CONFIRM BOOKING ──────────────────────────────────────────────────────────
// POST /api/bookings/confirm
const confirmBooking = async (req, res) => {
  try {
    const { tripId } = req.body;

    if (!tripId) {
      return res.status(400).json({ success: false, message: "Trip ID is required" });
    }

    // Check trip exists and belongs to user
    const trip = await Trip.findOne({ _id: tripId, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    // Check if already booked
    const existing = await Booking.findOne({ tripId });
    if (existing) {
      return res.status(400).json({ success: false, message: "This trip is already booked", data: existing });
    }

    // Calculate total cost
    const numberOfDays = trip.numberOfDays || 1;
    const travelers = trip.travelers || 1;

    let totalCost = 0;
    if (trip.selectedTrain?.classes && trip.selectedTrain?.selectedClass) {
      const cls = trip.selectedTrain.classes.find((c) => c.className === trip.selectedTrain.selectedClass);
      if (cls) totalCost += cls.price * travelers * 2;
    }
    if (trip.selectedHotel?.pricePerNight) totalCost += trip.selectedHotel.pricePerNight * numberOfDays * travelers;
    if (trip.selectedTransport?.pricePerDay) totalCost += trip.selectedTransport.pricePerDay * numberOfDays;

    // Create booking
    const booking = await Booking.create({
      tripId,
      userId: req.user.id,
      bookingReference: generateBookingRef(),
      status: "confirmed",
      totalCost,
      tripSnapshot: {
        city: trip.city,
        fromCity: trip.fromCity,
        startDate: trip.startDate,
        endDate: trip.endDate,
        numberOfDays: trip.numberOfDays,
        travelers: trip.travelers,
        tripType: trip.tripType,
        selectedTrain: trip.selectedTrain,
        selectedHotel: trip.selectedHotel,
        selectedTransport: trip.selectedTransport,
      },
    });

    // Update trip status
    await Trip.findByIdAndUpdate(tripId, { status: "confirmed", estimatedCost: totalCost });

    // Send confirmation email
    const user = await User.findById(req.user.id);
    let emailSent = false;
    try {
      await sendBookingConfirmation({
        toEmail: user.email,
        userName: user.name,
        booking,
        trip,
      });
      emailSent = true;
      await Booking.findByIdAndUpdate(booking._id, { emailSent: true });
    } catch (emailErr) {
      console.error("Email failed (non-critical):", emailErr.message);
      // Don't fail the whole booking just because email failed
    }

    res.status(201).json({
      success: true,
      message: "Trip booked successfully!",
      data: { ...booking.toObject(), emailSent },
    });
  } catch (error) {
    console.error("confirmBooking error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── GET BOOKING BY TRIP ID ───────────────────────────────────────────────────
// GET /api/bookings/:tripId
const getBookingByTrip = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      tripId: req.params.tripId,
      userId: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: "No booking found for this trip" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("getBookingByTrip error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── RESEND CONFIRMATION EMAIL ────────────────────────────────────────────────
// POST /api/bookings/:tripId/resend-email
const resendEmail = async (req, res) => {
  try {
    const booking = await Booking.findOne({ tripId: req.params.tripId, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    const trip = await Trip.findById(booking.tripId);
    const user = await User.findById(req.user.id);

    await sendBookingConfirmation({ toEmail: user.email, userName: user.name, booking, trip });
    await Booking.findByIdAndUpdate(booking._id, { emailSent: true });

    res.status(200).json({ success: true, message: "Confirmation email resent successfully" });
  } catch (error) {
    console.error("resendEmail error:", error);
    res.status(500).json({ success: false, message: "Failed to resend email" });
  }
};

module.exports = { confirmBooking, getBookingByTrip, resendEmail };