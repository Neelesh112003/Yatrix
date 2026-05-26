
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

//  Load environment variables from .env 

dotenv.config();

//  Connect to MongoDB 
connectDB();

//  Initialize Express App 
const app = express();

//  Global Middleware 

// CORS — allow requests from the frontend dev server
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded bodies (for form submissions)

app.use(express.urlencoded({ extended: true }));

// Routes 

app.use("/api/auth", require("./routes/auth"));

app.use("/api/destinations", require("./routes/destinations"));

app.use("/api/trips", require("./routes/trips"));

app.use("/api/bookings", require("./routes/bookings")); 

//  Health Check Route 

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Yatrix Backend API is running",
  });
});

// 404 Handler — for undefined routes 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

//  Global Error Handler 

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});