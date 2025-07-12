const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Create Access Token
const createAccessToken = (_id) => {
  return jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

// Create Refresh Token
const createRefreshToken = (_id) => {
  return jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// Create Reset Password Token
const createResetToken = (_id) => {
  return jwt.sign({ _id }, process.env.RESET_TOKEN_SECRET, { expiresIn: "10m" });
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // ✅ For localhost development
      sameSite: "lax", // ✅ Less strict for localhost cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ email, accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Signup User
const signupUser = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const user = await User.signup(email, password, name);
    const accessToken = createAccessToken(user._id);
    const refreshToken = createRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // ✅ For localhost
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ email, accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Forgot Password — Send reset link to email
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "No user found with that email" });

    const resetToken = createResetToken(user._id);
    const resetURL = `http://localhost:5500/reset-password.html?token=${resetToken}`; // ✅ for local frontend

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>This link will expire in 10 minutes.</p>
      `,
    });

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).json({ error: "Invalid reset link" });

    await User.resetPassword(user.email, newPassword, user._id.toString());

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired reset link" });
  }
};

// Refresh Access Token
const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token found" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = createAccessToken(decoded._id);

    res.status(200).json({ accessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
  }
};

// Logout User
const logoutUser = (req, res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    secure: false, // ✅ Localhost: must be false
    sameSite: "lax",
    maxAge: 0,
  });

  res.status(200).json({ message: "Logged out successfully" });
};


// Get User Details (protected)
const getDetails = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user details" });
  }
};


// Exports
module.exports = {
  loginUser,
  signupUser,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logoutUser,
  getDetails,
};
