const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authcontroller");
const { protect } = require("../middleware/authmiddleware");

//  Public Routes
router.post("/register", register);
router.post("/login", login);

//  Protected Route — Get Current User
router.get("/me", protect, getMe);

module.exports = router;