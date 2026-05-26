// backend/services/emailService.js
// Sends booking confirmation email using Nodemailer + Gmail SMTP

const nodemailer = require("nodemailer");

// ─── Create transporter ───────────────────────────────────────────────────────
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,   // your Gmail address
      pass: process.env.EMAIL_PASS,   // Gmail App Password (not your login password)
    },
  });
};

// ─── Send booking confirmation email ─────────────────────────────────────────
const sendBookingConfirmation = async ({ toEmail, userName, booking, trip }) => {
  const transporter = createTransporter();

  const startDate = new Date(trip.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const endDate = new Date(trip.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  const trainInfo = trip.selectedTrain
    ? `${trip.selectedTrain.name} (${trip.selectedTrain.selectedClass}) — ${trip.selectedTrain.departureTime} to ${trip.selectedTrain.arrivalTime}`
    : "Not selected";

  const hotelInfo = trip.selectedHotel
    ? `${trip.selectedHotel.name} — ₹${trip.selectedHotel.pricePerNight}/night`
    : "Not selected";

  const transportInfo = trip.selectedTransport
    ? `${trip.selectedTransport.type} — ₹${trip.selectedTransport.pricePerDay}/day`
    : "Not selected";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
    .header { background: #2563eb; color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 8px 0 0; opacity: 0.85; font-size: 14px; }
    .body { padding: 30px; }
    .greeting { font-size: 16px; color: #111; margin-bottom: 20px; }
    .ref-box { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px; }
    .ref-box p { margin: 0; color: #6b7280; font-size: 13px; }
    .ref-box h2 { margin: 6px 0 0; color: #2563eb; font-size: 22px; letter-spacing: 2px; }
    .section { margin-bottom: 24px; }
    .section h3 { font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #6b7280; }
    .detail-value { color: #111; font-weight: 500; text-align: right; max-width: 60%; }
    .total-row { display: flex; justify-content: space-between; padding: 12px 0; font-size: 15px; font-weight: 600; color: #111; }
    .footer { background: #f9fafb; padding: 20px 30px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; }
    .badge { display: inline-block; background: #d1fae5; color: #065f46; font-size: 12px; padding: 4px 12px; border-radius: 20px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Yatrix</h1>
      <p>Smart Travel Planning</p>
    </div>
    <div class="body">
      <p class="greeting">Hi ${userName},<br>Your trip has been confirmed! 🎉</p>

      <div class="ref-box">
        <p>Booking Reference</p>
        <h2>${booking.bookingReference}</h2>
        <span class="badge">✓ Confirmed</span>
      </div>

      <div class="section">
        <h3>Trip Details</h3>
        <div class="detail-row"><span class="detail-label">Destination</span><span class="detail-value">${trip.city}</span></div>
        <div class="detail-row"><span class="detail-label">From</span><span class="detail-value">${trip.fromCity || "—"}</span></div>
        <div class="detail-row"><span class="detail-label">Travel Dates</span><span class="detail-value">${startDate} → ${endDate}</span></div>
        <div class="detail-row"><span class="detail-label">Duration</span><span class="detail-value">${trip.numberOfDays} day(s)</span></div>
        <div class="detail-row"><span class="detail-label">Travelers</span><span class="detail-value">${trip.travelers} person(s)</span></div>
        <div class="detail-row"><span class="detail-label">Trip Type</span><span class="detail-value">${trip.tripType}</span></div>
      </div>

      <div class="section">
        <h3>Your Selections</h3>
        <div class="detail-row"><span class="detail-label">🚆 Train</span><span class="detail-value">${trainInfo}</span></div>
        <div class="detail-row"><span class="detail-label">🏨 Hotel</span><span class="detail-value">${hotelInfo}</span></div>
        <div class="detail-row"><span class="detail-label">🚗 Transport</span><span class="detail-value">${transportInfo}</span></div>
      </div>

      <div class="section">
        <h3>Cost Summary</h3>
        <div class="total-row"><span>Estimated Total</span><span>₹${booking.totalCost.toLocaleString("en-IN")}</span></div>
      </div>

      <p style="font-size: 13px; color: #6b7280; margin-top: 8px;">
        This is a mock booking confirmation for demonstration purposes. No actual payment has been processed.
      </p>
    </div>
    <div class="footer">
      <p>Yatrix — Smart Travel Planning System</p>
      <p>This email was sent to ${toEmail}</p>
    </div>
  </div>
</body>
</html>
  `;

  const mailOptions = {
    from: `"Yatrix Travel" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `✅ Booking Confirmed — ${trip.city} Trip | ${booking.bookingReference}`,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation };