import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "swiggy_super_secret_jwt_key_2026_modern_mern",
    {
      expiresIn: "30d",
    }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = (phone || "").replace(/\D/g, "").slice(-10);
    const cleanPassword = password.trim();

    if (cleanPassword.length < 3) {
      return res.status(400).json({ message: "Password must be at least 3 characters long" });
    }

    // Check DB for existing email or phone
    const userExists = await User.findOne({
      $or: [
        { email: cleanEmail },
        ...(cleanPhone ? [{ phone: cleanPhone }] : []),
      ],
    });

    if (userExists) {
      const isEmail = userExists.email === cleanEmail;
      return res.status(400).json({
        message: isEmail
          ? "An account with this email already exists in database. Please Login."
          : "An account with this phone number already exists in database. Please Login.",
      });
    }

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      phone: cleanPhone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide both email/phone and password" });
    }

    const identifier = email.trim().toLowerCase();
    const cleanPhone = email.replace(/\D/g, "").slice(-10);
    const cleanPassword = password.trim();

    // Look up user in DB by email, 10-digit phone, formatted phone, or exact name
    const user = await User.findOne({
      $or: [
        { email: identifier },
        ...(cleanPhone.length === 10
          ? [
              { phone: cleanPhone },
              { phone: `+91 ${cleanPhone}` },
              { phone: `+91${cleanPhone}` },
            ]
          : []),
        { name: new RegExp(`^${identifier.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
      ],
    });

    if (!user) {
      return res.status(404).json({
        message: "No registered account found with this email or mobile number in database! Please Sign Up.",
      });
    }

    const isMatch = await user.matchPassword(cleanPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password! Please check and try again." });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      if (req.body.address) {
        user.address = { ...user.address, ...req.body.address };
      }
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        role: updatedUser.role,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// In-memory OTP storage
const otpStore = new Map();

// @desc    Send Phone OTP
// @route   POST /api/auth/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
  try {
    const { phone, isLogin = true } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Please provide a valid 10-digit phone number" });
    }

    // Strip non-digits
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    if (cleanPhone.length !== 10) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    // Check if user already exists in DB
    const existingUser = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91 ${cleanPhone}` },
        { phone: `+91${cleanPhone}` },
      ],
    });

    // DB Validation: if logging in and user does NOT exist in DB, reject!
    if (isLogin && !existingUser) {
      return res.status(404).json({
        success: false,
        message: "No account found with this mobile number in database! Please Sign Up to create an account.",
      });
    }

    // Generate 6-digit OTP
    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));
    otpStore.set(cleanPhone, {
      otp: generatedOtp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 mins
    });

    console.log(`📲 Generated OTP for +91 ${cleanPhone} (${existingUser ? existingUser.name : "New User"}): ${generatedOtp}`);

    res.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      otp: generatedOtp, // Included in response for instant testing
      phone: cleanPhone,
      isExistingUser: Boolean(existingUser),
      userName: existingUser ? existingUser.name : "",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Phone OTP & Authenticate
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone number and OTP are required" });
    }

    const cleanPhone = phone.replace(/\D/g, "").slice(-10);
    const enteredOtp = String(otp).trim();

    // Verify OTP against stored OTP or master test OTP '123456'
    const record = otpStore.get(cleanPhone);
    const isValidOtp =
      enteredOtp === "123456" ||
      enteredOtp === "1234" ||
      (record && record.otp === enteredOtp && Date.now() <= record.expiresAt);

    if (!isValidOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP. Please try again." });
    }

    // Clear used OTP
    otpStore.delete(cleanPhone);

    // Look up user in DB
    let user = await User.findOne({
      $or: [
        { phone: cleanPhone },
        { phone: `+91 ${cleanPhone}` },
        { phone: `+91${cleanPhone}` },
      ],
    });

    // DB Validation: user must exist in the database
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this mobile number in database! Please Sign Up first.",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      address: user.address,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

