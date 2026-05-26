require("dotenv").config();
const mongoose = require("mongoose");
const Destination = require("../models/Destination");
const Train = require("../models/Train");
const Hotel = require("../models/Hotel");
const Transport = require("../models/Transport");

// ─── 1. DESTINATIONS + SUB-DESTINATIONS (your original data — unchanged) ──────
const destinations = [
  {
    city: "Delhi",
    state: "Delhi",
    description: "India's capital — a city where Mughal history meets modern India. From Red Fort to Qutub Minar, every corner tells a story.",
    avgCostPerDay: 2500,
    bestTimeToVisit: "October to March",
    tags: ["Heritage", "Food", "Shopping", "History"],
    subDestinations: [
      { name: "Red Fort", description: "UNESCO World Heritage Site — iconic Mughal-era fort built by Emperor Shah Jahan.", distanceFromCity: "In Old Delhi", type: "Heritage", entryFee: 35, timingHours: "9:30 AM - 4:30 PM (Closed Monday)" },
      { name: "Qutub Minar", description: "The tallest brick minaret in the world, built in 1193. A must-visit UNESCO site.", distanceFromCity: "16 km from city center", type: "Heritage", entryFee: 40, timingHours: "Sunrise to Sunset" },
      { name: "India Gate", description: "War memorial dedicated to Indian soldiers — surrounded by beautiful lawns, perfect for evenings.", distanceFromCity: "In Central Delhi", type: "Monument", entryFee: 0, timingHours: "Open 24 hours" },
      { name: "Chandni Chowk", description: "One of India's oldest and busiest markets — street food paradise and shopping hub.", distanceFromCity: "In Old Delhi", type: "Market", entryFee: 0, timingHours: "9 AM - 8 PM (Closed Sunday)" },
      { name: "Lotus Temple", description: "Stunning Bahá'í House of Worship shaped like a lotus flower — open to all religions.", distanceFromCity: "14 km from city center", type: "Temple", entryFee: 0, timingHours: "9 AM - 5:30 PM (Closed Monday)" },
      { name: "Humayun's Tomb", description: "Breathtaking Mughal garden-tomb that inspired the Taj Mahal — UNESCO World Heritage Site.", distanceFromCity: "10 km from city center", type: "Heritage", entryFee: 40, timingHours: "Sunrise to Sunset" },
    ],
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    description: "The Pink City of India — royal palaces, majestic forts, and vibrant bazaars make Jaipur an unforgettable experience.",
    avgCostPerDay: 2000,
    bestTimeToVisit: "November to February",
    tags: ["Heritage", "Culture", "Shopping", "Royalty"],
    subDestinations: [
      { name: "Amber Fort", description: "Magnificent hilltop fort with stunning palaces, courtyards, and panoramic views of Maota Lake.", distanceFromCity: "11 km from Jaipur", type: "Fort", entryFee: 100, timingHours: "8 AM - 5:30 PM" },
      { name: "Hawa Mahal", description: "Palace of Winds — iconic 5-storey pink sandstone structure with 953 small windows.", distanceFromCity: "In Jaipur city center", type: "Palace", entryFee: 50, timingHours: "9 AM - 4:30 PM" },
      { name: "City Palace", description: "Stunning blend of Rajput and Mughal architecture — houses a museum with royal artifacts.", distanceFromCity: "In Jaipur city center", type: "Palace", entryFee: 200, timingHours: "9:30 AM - 5 PM" },
      { name: "Jantar Mantar", description: "UNESCO World Heritage Site — world's largest stone sundial and 18 astronomical instruments.", distanceFromCity: "In Jaipur city center", type: "Heritage", entryFee: 50, timingHours: "9 AM - 4:30 PM" },
      { name: "Nahargarh Fort", description: "Hilltop fort with the best sunset views of Jaipur city — great for photography.", distanceFromCity: "8 km from Jaipur", type: "Fort", entryFee: 50, timingHours: "10 AM - 5:30 PM" },
      { name: "Johri Bazaar", description: "Jaipur's famous jewellery and gemstone market — also great for traditional Rajasthani textiles.", distanceFromCity: "In Jaipur city center", type: "Market", entryFee: 0, timingHours: "10 AM - 8 PM" },
    ],
  },
  {
    city: "Chandigarh",
    state: "Punjab/Haryana",
    description: "India's most planned city — designed by Le Corbusier. Known for lush gardens, clean roads, and vibrant café culture.",
    avgCostPerDay: 2200,
    bestTimeToVisit: "October to March",
    tags: ["Gardens", "Modern", "Food", "Nature"],
    subDestinations: [
      { name: "Rock Garden", description: "Unique sculpture garden built entirely from industrial and urban waste by Nek Chand — a true masterpiece.", distanceFromCity: "In Chandigarh (Sector 1)", type: "Garden", entryFee: 30, timingHours: "9 AM - 6 PM" },
      { name: "Sukhna Lake", description: "Man-made reservoir at the foothills of Shivaliks — perfect for morning walks, boating, and relaxation.", distanceFromCity: "In Chandigarh (Sector 1)", type: "Nature", entryFee: 0, timingHours: "5 AM - 10 PM" },
      { name: "Rose Garden (Zakir Hussain)", description: "Asia's largest rose garden with over 1600 varieties of roses — best visited during February-March.", distanceFromCity: "In Chandigarh (Sector 16)", type: "Garden", entryFee: 30, timingHours: "6 AM - 10 PM" },
      { name: "Elante Mall & Sector 17", description: "Chandigarh's premier shopping district — from luxury malls to bustling street markets.", distanceFromCity: "In Chandigarh", type: "Shopping", entryFee: 0, timingHours: "10 AM - 10 PM" },
      { name: "Pinjore Gardens (Yadavindra Gardens)", description: "Mughal-style terraced garden built in the 17th century — serene and beautifully maintained.", distanceFromCity: "22 km from Chandigarh", type: "Garden", entryFee: 20, timingHours: "7 AM - 10 PM" },
      { name: "Morni Hills", description: "Only hill station near Chandigarh — offers trekking, bird watching, and stunning valley views.", distanceFromCity: "45 km from Chandigarh", type: "Nature", entryFee: 0, timingHours: "Open all day" },
    ],
  },
  {
    city: "Jabalpur",
    state: "Madhya Pradesh",
    description: "The Marble City of India — gateway to Kanha National Park and home to the stunning Dhuandhar Falls and Marble Rocks.",
    avgCostPerDay: 1500,
    bestTimeToVisit: "October to March",
    tags: ["Nature", "Wildlife", "Adventure", "Waterfalls"],
    subDestinations: [
      { name: "Marble Rocks (Bhedaghat)", description: "Stunning 100-ft high marble cliffs along the Narmada river — best experienced on a boat ride.", distanceFromCity: "25 km from Jabalpur", type: "Nature", entryFee: 30, timingHours: "Sunrise to Sunset" },
      { name: "Dhuandhar Falls", description: "The 'Smoke Cascade' — Narmada river plunges through marble rocks creating a misty waterfall spectacle.", distanceFromCity: "25 km from Jabalpur", type: "Waterfall", entryFee: 0, timingHours: "Open all day" },
      { name: "Kanha National Park", description: "One of India's best tiger reserves — inspired Rudyard Kipling's Jungle Book. Excellent safari experience.", distanceFromCity: "160 km from Jabalpur", type: "Wildlife", entryFee: 2000, timingHours: "6 AM - 11 AM, 3 PM - 6 PM (Closed Tuesday afternoon)" },
      { name: "Chausath Yogini Temple", description: "Circular 10th-century hilltop temple with 81 pillars — offers panoramic views of Jabalpur.", distanceFromCity: "In Jabalpur", type: "Temple", entryFee: 0, timingHours: "6 AM - 6 PM" },
      { name: "Madan Mahal Fort", description: "11th-century fort built by Gond king Madan Shah — perched dramatically on a rocky hilltop.", distanceFromCity: "3 km from Jabalpur center", type: "Fort", entryFee: 10, timingHours: "8 AM - 5 PM" },
      { name: "Balancing Rock", description: "Geological wonder — a massive boulder naturally balanced on a small base, defying gravity.", distanceFromCity: "4 km from Jabalpur center", type: "Nature", entryFee: 0, timingHours: "Open all day" },
    ],
  },
];

// ─── 2. TRAINS — ALL 12 CITY-PAIR COMBINATIONS ───────────────────────────────
// 6 pairs × 2 directions = 12 routes, 2-3 trains each = 32 total trains
const trains = [

  // ── Delhi → Jaipur ──────────────────────────────────────────────────────────
  { name: "Ajmer Shatabdi", trainNumber: "12015", fromCity: "Delhi", toCity: "Jaipur", departureTime: "06:05 AM", arrivalTime: "10:40 AM", duration: "4h 35m", classes: [{ className: "CC", price: 620 }, { className: "EC", price: 1200 }], daysOfOperation: "Daily except Tuesday", rating: 4.4 },
  { name: "Double Decker Express", trainNumber: "12985", fromCity: "Delhi", toCity: "Jaipur", departureTime: "06:05 AM", arrivalTime: "11:00 AM", duration: "4h 55m", classes: [{ className: "CC", price: 385 }, { className: "EC", price: 750 }], daysOfOperation: "Daily", rating: 4.2 },
  { name: "Pink City Express", trainNumber: "12450", fromCity: "Delhi", toCity: "Jaipur", departureTime: "05:45 AM", arrivalTime: "11:15 AM", duration: "5h 30m", classes: [{ className: "Sleeper", price: 220 }, { className: "3AC", price: 590 }, { className: "2AC", price: 830 }], daysOfOperation: "Daily", rating: 3.8 },

  // ── Jaipur → Delhi ──────────────────────────────────────────────────────────
  { name: "Ajmer Shatabdi Return", trainNumber: "12016", fromCity: "Jaipur", toCity: "Delhi", departureTime: "05:50 PM", arrivalTime: "10:30 PM", duration: "4h 40m", classes: [{ className: "CC", price: 620 }, { className: "EC", price: 1200 }], daysOfOperation: "Daily except Tuesday", rating: 4.4 },
  { name: "Jaipur Superfast", trainNumber: "12413", fromCity: "Jaipur", toCity: "Delhi", departureTime: "04:30 AM", arrivalTime: "09:15 AM", duration: "4h 45m", classes: [{ className: "Sleeper", price: 240 }, { className: "3AC", price: 640 }, { className: "2AC", price: 900 }], daysOfOperation: "Daily", rating: 4.0 },
  { name: "Mandore Express", trainNumber: "14660", fromCity: "Jaipur", toCity: "Delhi", departureTime: "08:00 PM", arrivalTime: "05:15 AM", duration: "9h 15m", classes: [{ className: "Sleeper", price: 190 }, { className: "3AC", price: 510 }], daysOfOperation: "Daily", rating: 3.6 },

  // ── Delhi → Chandigarh ──────────────────────────────────────────────────────
  { name: "Shatabdi Express", trainNumber: "12045", fromCity: "Delhi", toCity: "Chandigarh", departureTime: "07:40 AM", arrivalTime: "11:00 AM", duration: "3h 20m", classes: [{ className: "CC", price: 645 }, { className: "EC", price: 1250 }], daysOfOperation: "Daily except Wednesday", rating: 4.5 },
  { name: "Jan Shatabdi Express", trainNumber: "12053", fromCity: "Delhi", toCity: "Chandigarh", departureTime: "06:15 AM", arrivalTime: "09:55 AM", duration: "3h 40m", classes: [{ className: "CC", price: 420 }, { className: "2S", price: 180 }], daysOfOperation: "Daily", rating: 4.0 },
  { name: "Himalayan Queen", trainNumber: "14095", fromCity: "Delhi", toCity: "Chandigarh", departureTime: "06:00 AM", arrivalTime: "10:35 AM", duration: "4h 35m", classes: [{ className: "Sleeper", price: 200 }, { className: "3AC", price: 540 }], daysOfOperation: "Daily", rating: 3.7 },

  // ── Chandigarh → Delhi ──────────────────────────────────────────────────────
  { name: "Shatabdi Express Return", trainNumber: "12046", fromCity: "Chandigarh", toCity: "Delhi", departureTime: "05:30 PM", arrivalTime: "08:40 PM", duration: "3h 10m", classes: [{ className: "CC", price: 645 }, { className: "EC", price: 1250 }], daysOfOperation: "Daily except Wednesday", rating: 4.5 },
  { name: "Chandigarh Express", trainNumber: "11057", fromCity: "Chandigarh", toCity: "Delhi", departureTime: "11:00 PM", arrivalTime: "05:30 AM", duration: "6h 30m", classes: [{ className: "Sleeper", price: 180 }, { className: "3AC", price: 480 }], daysOfOperation: "Daily", rating: 3.8 },
  { name: "Una Himachal Express", trainNumber: "14553", fromCity: "Chandigarh", toCity: "Delhi", departureTime: "09:45 AM", arrivalTime: "03:10 PM", duration: "5h 25m", classes: [{ className: "Sleeper", price: 160 }, { className: "3AC", price: 430 }], daysOfOperation: "Daily", rating: 3.5 },

  // ── Delhi → Jabalpur ────────────────────────────────────────────────────────
  { name: "Gondwana Express", trainNumber: "12411", fromCity: "Delhi", toCity: "Jabalpur", departureTime: "07:25 PM", arrivalTime: "10:30 AM", duration: "15h 05m", classes: [{ className: "Sleeper", price: 380 }, { className: "3AC", price: 1020 }, { className: "2AC", price: 1500 }], daysOfOperation: "Daily", rating: 3.9 },
  { name: "Mahakoshal Express", trainNumber: "11271", fromCity: "Delhi", toCity: "Jabalpur", departureTime: "10:05 PM", arrivalTime: "02:55 PM", duration: "16h 50m", classes: [{ className: "Sleeper", price: 320 }, { className: "3AC", price: 870 }], daysOfOperation: "Daily", rating: 3.6 },
  { name: "Jabalpur Express", trainNumber: "18237", fromCity: "Delhi", toCity: "Jabalpur", departureTime: "04:15 PM", arrivalTime: "08:45 AM", duration: "16h 30m", classes: [{ className: "Sleeper", price: 300 }, { className: "3AC", price: 820 }, { className: "2AC", price: 1200 }], daysOfOperation: "Mon, Wed, Fri, Sun", rating: 3.7 },

  // ── Jabalpur → Delhi ────────────────────────────────────────────────────────
  { name: "Gondwana Express Return", trainNumber: "12412", fromCity: "Jabalpur", toCity: "Delhi", departureTime: "06:15 PM", arrivalTime: "09:20 AM", duration: "15h 05m", classes: [{ className: "Sleeper", price: 380 }, { className: "3AC", price: 1020 }, { className: "2AC", price: 1500 }], daysOfOperation: "Daily", rating: 3.9 },
  { name: "Mahakoshal Return", trainNumber: "11272", fromCity: "Jabalpur", toCity: "Delhi", departureTime: "08:30 AM", arrivalTime: "11:55 PM", duration: "15h 25m", classes: [{ className: "Sleeper", price: 320 }, { className: "3AC", price: 870 }], daysOfOperation: "Daily", rating: 3.6 },

  // ── Jaipur → Chandigarh ─────────────────────────────────────────────────────
  { name: "Jaipur Chandigarh Express", trainNumber: "12991", fromCity: "Jaipur", toCity: "Chandigarh", departureTime: "11:15 PM", arrivalTime: "09:30 AM", duration: "10h 15m", classes: [{ className: "Sleeper", price: 290 }, { className: "3AC", price: 780 }, { className: "2AC", price: 1100 }], daysOfOperation: "Daily", rating: 3.8 },
  { name: "Ajmer Chandigarh Express", trainNumber: "12459", fromCity: "Jaipur", toCity: "Chandigarh", departureTime: "06:30 AM", arrivalTime: "06:15 PM", duration: "11h 45m", classes: [{ className: "Sleeper", price: 310 }, { className: "3AC", price: 830 }], daysOfOperation: "Tue, Thu, Sat", rating: 3.7 },

  // ── Chandigarh → Jaipur ─────────────────────────────────────────────────────
  { name: "Chandigarh Jaipur Express", trainNumber: "12992", fromCity: "Chandigarh", toCity: "Jaipur", departureTime: "08:15 PM", arrivalTime: "07:45 AM", duration: "11h 30m", classes: [{ className: "Sleeper", price: 290 }, { className: "3AC", price: 780 }, { className: "2AC", price: 1100 }], daysOfOperation: "Daily", rating: 3.8 },
  { name: "Himalayan Jaipur Express", trainNumber: "14731", fromCity: "Chandigarh", toCity: "Jaipur", departureTime: "10:00 PM", arrivalTime: "10:30 AM", duration: "12h 30m", classes: [{ className: "Sleeper", price: 260 }, { className: "3AC", price: 700 }], daysOfOperation: "Mon, Wed, Fri", rating: 3.5 },

  // ── Jaipur → Jabalpur ───────────────────────────────────────────────────────
  { name: "Jaipur Jabalpur Express", trainNumber: "19666", fromCity: "Jaipur", toCity: "Jabalpur", departureTime: "03:45 PM", arrivalTime: "09:00 AM", duration: "17h 15m", classes: [{ className: "Sleeper", price: 340 }, { className: "3AC", price: 920 }, { className: "2AC", price: 1350 }], daysOfOperation: "Mon, Thu, Sat", rating: 3.7 },
  { name: "Marudhar Express", trainNumber: "14853", fromCity: "Jaipur", toCity: "Jabalpur", departureTime: "09:20 PM", arrivalTime: "04:30 PM", duration: "19h 10m", classes: [{ className: "Sleeper", price: 300 }, { className: "3AC", price: 810 }], daysOfOperation: "Tue, Fri, Sun", rating: 3.5 },

  // ── Jabalpur → Jaipur ───────────────────────────────────────────────────────
  { name: "Jabalpur Jaipur Express", trainNumber: "19665", fromCity: "Jabalpur", toCity: "Jaipur", departureTime: "07:00 PM", arrivalTime: "12:30 PM", duration: "17h 30m", classes: [{ className: "Sleeper", price: 340 }, { className: "3AC", price: 920 }, { className: "2AC", price: 1350 }], daysOfOperation: "Mon, Thu, Sat", rating: 3.7 },
  { name: "Narmada Jaipur Express", trainNumber: "19601", fromCity: "Jabalpur", toCity: "Jaipur", departureTime: "05:30 AM", arrivalTime: "11:45 PM", duration: "18h 15m", classes: [{ className: "Sleeper", price: 280 }, { className: "3AC", price: 760 }], daysOfOperation: "Wed, Sat", rating: 3.4 },

  // ── Chandigarh → Jabalpur ───────────────────────────────────────────────────
  { name: "Chandigarh Jabalpur Express", trainNumber: "11449", fromCity: "Chandigarh", toCity: "Jabalpur", departureTime: "02:30 PM", arrivalTime: "08:00 AM", duration: "17h 30m", classes: [{ className: "Sleeper", price: 360 }, { className: "3AC", price: 970 }, { className: "2AC", price: 1400 }], daysOfOperation: "Mon, Wed, Fri", rating: 3.6 },
  { name: "Punjab Mail via Jabalpur", trainNumber: "11013", fromCity: "Chandigarh", toCity: "Jabalpur", departureTime: "11:45 PM", arrivalTime: "07:15 PM", duration: "19h 30m", classes: [{ className: "Sleeper", price: 310 }, { className: "3AC", price: 840 }], daysOfOperation: "Daily", rating: 3.5 },

  // ── Jabalpur → Chandigarh ───────────────────────────────────────────────────
  { name: "Jabalpur Chandigarh Express", trainNumber: "11450", fromCity: "Jabalpur", toCity: "Chandigarh", departureTime: "06:00 PM", arrivalTime: "11:45 AM", duration: "17h 45m", classes: [{ className: "Sleeper", price: 360 }, { className: "3AC", price: 970 }, { className: "2AC", price: 1400 }], daysOfOperation: "Tue, Thu, Sat", rating: 3.6 },
  { name: "Narmada Chandigarh Express", trainNumber: "11014", fromCity: "Jabalpur", toCity: "Chandigarh", departureTime: "08:45 AM", arrivalTime: "06:30 AM", duration: "21h 45m", classes: [{ className: "Sleeper", price: 290 }, { className: "3AC", price: 790 }], daysOfOperation: "Daily", rating: 3.4 },
];

// ─── 3. HOTELS (your original data — unchanged) ───────────────────────────────
const hotels = [
  // Delhi
  { name: "OYO Rooms Paharganj", city: "Delhi", pricePerNight: 800, rating: 3.2, category: "Budget", suitability: ["Solo"], amenities: ["WiFi", "AC"], address: "Paharganj, New Delhi" },
  { name: "Hotel Hari Piorko", city: "Delhi", pricePerNight: 1400, rating: 3.8, category: "Budget", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Breakfast"], address: "Paharganj, New Delhi" },
  { name: "Bloom Hotel Karol Bagh", city: "Delhi", pricePerNight: 2500, rating: 4.2, category: "Mid-range", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Breakfast", "Parking"], address: "Karol Bagh, New Delhi" },
  { name: "The Leela Palace", city: "Delhi", pricePerNight: 12000, rating: 4.8, category: "Luxury", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Pool", "Spa", "Breakfast", "Restaurant"], address: "Diplomatic Enclave, New Delhi" },
  // Jaipur
  { name: "Zostel Jaipur", city: "Jaipur", pricePerNight: 500, rating: 4.0, category: "Budget", suitability: ["Solo"], amenities: ["WiFi", "Common Kitchen"], address: "Bani Park, Jaipur" },
  { name: "Hotel Pearl Palace", city: "Jaipur", pricePerNight: 1200, rating: 4.3, category: "Budget", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Breakfast", "Rooftop"], address: "Hari Kishan Somani Marg, Jaipur" },
  { name: "Umaid Mahal Heritage Hotel", city: "Jaipur", pricePerNight: 3500, rating: 4.5, category: "Mid-range", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Pool", "Breakfast", "Heritage Architecture"], address: "Bani Park, Jaipur" },
  { name: "Rambagh Palace", city: "Jaipur", pricePerNight: 18000, rating: 4.9, category: "Luxury", suitability: ["Family"], amenities: ["WiFi", "AC", "Pool", "Spa", "Restaurant", "Gardens"], address: "Bhawani Singh Road, Jaipur" },
  // Chandigarh
  { name: "OYO Rooms Sector 22", city: "Chandigarh", pricePerNight: 900, rating: 3.3, category: "Budget", suitability: ["Solo"], amenities: ["WiFi", "AC"], address: "Sector 22, Chandigarh" },
  { name: "Hotel Aroma", city: "Chandigarh", pricePerNight: 2200, rating: 4.0, category: "Mid-range", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Breakfast", "Restaurant"], address: "Sector 22, Chandigarh" },
  { name: "Lalit Hotel Chandigarh", city: "Chandigarh", pricePerNight: 5500, rating: 4.6, category: "Luxury", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Pool", "Spa", "Breakfast"], address: "Rajiv Gandhi IT Park, Chandigarh" },
  { name: "Hyatt Regency Chandigarh", city: "Chandigarh", pricePerNight: 8000, rating: 4.7, category: "Luxury", suitability: ["Family"], amenities: ["WiFi", "AC", "Pool", "Gym", "Spa", "Restaurant"], address: "Sector 38, Chandigarh" },
  // Jabalpur
  { name: "Hotel Narmada Jacksons", city: "Jabalpur", pricePerNight: 1800, rating: 3.9, category: "Mid-range", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Restaurant"], address: "Civil Lines, Jabalpur" },
  { name: "Kalchuri Residency", city: "Jabalpur", pricePerNight: 1200, rating: 3.7, category: "Budget", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Parking"], address: "Napier Town, Jabalpur" },
  { name: "Hotel Satya Ashoka", city: "Jabalpur", pricePerNight: 2800, rating: 4.1, category: "Mid-range", suitability: ["Solo", "Family"], amenities: ["WiFi", "AC", "Pool", "Breakfast", "Restaurant"], address: "Wright Town, Jabalpur" },
  { name: "Bhedaghat Resort", city: "Jabalpur", pricePerNight: 4500, rating: 4.4, category: "Luxury", suitability: ["Family"], amenities: ["WiFi", "AC", "Pool", "Breakfast", "River View"], address: "Bhedaghat, Jabalpur" },
];

// ─── 4. LOCAL TRANSPORT (your original data — unchanged) ─────────────────────
const transports = [
  // Delhi
  { city: "Delhi", type: "Metro", pricePerDay: 150, comfort: "High", suitability: ["Solo"], description: "Delhi Metro — fastest, cheapest, covers all major tourist spots." },
  { city: "Delhi", type: "Auto Rickshaw", pricePerDay: 400, comfort: "Low", suitability: ["Solo"], description: "Budget option for short trips. Negotiate fare before riding." },
  { city: "Delhi", type: "Private Cab", pricePerDay: 1200, comfort: "High", suitability: ["Solo", "Family"], description: "Book via Ola/Uber or hire a day cab. Best for family comfort." },
  { city: "Delhi", type: "Shared Cab", pricePerDay: 500, comfort: "Medium", suitability: ["Solo"], description: "Shared rides via Ola Share — affordable but fixed routes." },
  // Jaipur
  { city: "Jaipur", type: "Auto Rickshaw", pricePerDay: 350, comfort: "Low", suitability: ["Solo"], description: "Widely available. Great for short distances inside city." },
  { city: "Jaipur", type: "Private Cab", pricePerDay: 1000, comfort: "High", suitability: ["Solo", "Family"], description: "Best for visiting Amber Fort, Nahargarh and outskirts comfortably." },
  { city: "Jaipur", type: "Shared Cab", pricePerDay: 450, comfort: "Medium", suitability: ["Solo"], description: "Ola/Uber shared rides within city limits." },
  { city: "Jaipur", type: "City Bus", pricePerDay: 80, comfort: "Low", suitability: ["Solo"], description: "RSRTC city buses — cheapest option but crowded." },
  // Chandigarh
  { city: "Chandigarh", type: "Private Cab", pricePerDay: 900, comfort: "High", suitability: ["Solo", "Family"], description: "Recommended for day trips to Morni Hills and Pinjore Gardens." },
  { city: "Chandigarh", type: "Auto Rickshaw", pricePerDay: 300, comfort: "Low", suitability: ["Solo"], description: "Good for intra-sector travel within Chandigarh." },
  { city: "Chandigarh", type: "City Bus", pricePerDay: 60, comfort: "Low", suitability: ["Solo"], description: "CTU buses — very affordable for inter-sector travel." },
  { city: "Chandigarh", type: "Shared Cab", pricePerDay: 400, comfort: "Medium", suitability: ["Solo"], description: "Ola/Uber available across major sectors." },
  // Jabalpur
  { city: "Jabalpur", type: "Private Cab", pricePerDay: 800, comfort: "High", suitability: ["Solo", "Family"], description: "Essential for Bhedaghat, Marble Rocks, and Kanha day trips." },
  { city: "Jabalpur", type: "Auto Rickshaw", pricePerDay: 250, comfort: "Low", suitability: ["Solo"], description: "For local city sightseeing — Madan Mahal, Balancing Rock area." },
  { city: "Jabalpur", type: "Shared Cab", pricePerDay: 350, comfort: "Medium", suitability: ["Solo"], description: "Limited but available. Better to pre-book for Bhedaghat." },
  { city: "Jabalpur", type: "City Bus", pricePerDay: 50, comfort: "Low", suitability: ["Solo"], description: "MPSRTC city buses. Very cheap but not ideal for tourists." },
];

// ─── RUN SEED ─────────────────────────────────────────────────────────────────
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await Destination.deleteMany({});
    await Train.deleteMany({});
    await Hotel.deleteMany({});
    await Transport.deleteMany({});
    console.log("🗑️  Old data cleared");

    await Destination.insertMany(destinations);
    console.log(`✅ ${destinations.length} destinations seeded`);

    await Train.insertMany(trains);
    console.log(`✅ ${trains.length} trains seeded (all 12 city-pair combinations)`);

    await Hotel.insertMany(hotels);
    console.log(`✅ ${hotels.length} hotels seeded`);

    await Transport.insertMany(transports);
    console.log(`✅ ${transports.length} transport options seeded`);

    console.log("\n🎉 Yatrix database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedDB();