

const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../models/User");


const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },              // Payload — only store the user ID
    process.env.JWT_SECRET,      // Secret key from .env
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

// Zod Validation Schemas 
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// REGISTER 
const register = async (req, res) => {
  try {
    // 1. Validate request body with Zod
    const validatedData = registerSchema.parse(req.body);

    const { name, email, password } = validatedData;

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // 3. Create user (password gets hashed automatically via User model pre-save hook)
    const user = await User.create({ name, email, password });

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Send response
    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
  console.log("REGISTER ERROR =>", error);

  return res.status(500).json({
    success: false,
    message: error.message,
    stack: error.stack,
  });
}
};

//LOGIN 
const login = async (req, res) => {
  try {
    // 1. Validate request body
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    // 2. Find user by email — explicitly select password (it's hidden by default)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Compare entered password with stored hash
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Generate token and respond
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: error.errors[0].message,
      });
    }
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//  GET CURRENT USER 
const getMe = async (req, res) => {
  try {
    // req.user is set by the authMiddleware
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { register, login, getMe };