

const Destination = require("../models/Destination");
const Train = require("../models/Train");
const Hotel = require("../models/Hotel");
const Transport = require("../models/Transport");

// GET ALL 4 CITIES 
// GET /api/destinations

const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find({}).select(
      "city state description avgCostPerDay bestTimeToVisit tags imageUrl popular"
    );
    res.status(200).json({ success: true, data: destinations });
  } catch (error) {
    console.error("getAllDestinations error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ONE CITY WITH SUB-DESTINATIONS 
// GET /api/destinations/:city   (e.g. /api/destinations/Jaipur)

const getDestinationByCity = async (req, res) => {
  try {
    const { city } = req.params;

    const destination = await Destination.findOne({
      city: { $regex: new RegExp(`^${city}$`, "i") }, // case-insensitive match
    });

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: `No destination found for city: ${city}`,
      });
    }

    // Also fetch trains, hotels, transport for this city
    const trains = await Train.find({ toCity: destination.city });
    const hotels = await Hotel.find({ city: destination.city });
    const transports = await Transport.find({ city: destination.city });

    res.status(200).json({
      success: true,
      data: {
        destination,
        trains,
        hotels,
        transports,
      },
    });
  } catch (error) {
    console.error("getDestinationByCity error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET HOTELS BY CITY + OPTIONAL BUDGET FILTER 
// GET /api/destinations/:city/hotels?maxPrice=2000&tripType=Family

const getHotelsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { maxPrice, tripType } = req.query;

    let filter = { city };
    if (maxPrice) filter.pricePerNight = { $lte: Number(maxPrice) };
    if (tripType) filter.suitability = tripType;

    const hotels = await Hotel.find(filter).sort({ rating: -1 });
    res.status(200).json({ success: true, data: hotels });
  } catch (error) {
    console.error("getHotelsByCity error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/destinations/:city/trains?from=Delhi
const getTrainsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { from } = req.query;

    let filter = { toCity: city };
    if (from) filter.fromCity = from; // ← filter by source city

    const trains = await Train.find(filter).sort({ rating: -1 });
    res.status(200).json({ success: true, data: trains });
  } catch (error) {
    console.error("getTrainsByCity error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  GET TRANSPORT OPTIONS FOR A CITY 
// GET /api/destinations/:city/transport

const getTransportByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const transports = await Transport.find({ city }).sort({ pricePerDay: 1 });
    res.status(200).json({ success: true, data: transports });
  } catch (error) {
    console.error("getTransportByCity error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllDestinations,
  getDestinationByCity,
  getHotelsByCity,
  getTrainsByCity,
  getTransportByCity,
};