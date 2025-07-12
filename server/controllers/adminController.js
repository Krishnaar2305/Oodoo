const SwapRequest = require('../models/swapRequestModel');
const Announcement = require("../models/announcementModel");

const viewAllRequests = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin)
      return res.status(403).json({ error: "Unauthorized" });

    const users = await User.find({}, 'email pendingSkillSwaps');

    let allRequests = [];

    users.forEach(user => {
      user.pendingSkillSwaps.forEach(request => {
        allRequests.push({
          recipientEmail: user.email,
          ...request
        });
      });
    });

    res.status(200).json(allRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch swap requests" });
  }
};

const viewRequestsForUser = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin)
      return res.status(403).json({ error: "Unauthorized" });

    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json(user.pendingSkillSwaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user swap requests" });
  }
};

const viewAllAcceptedRequests = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin)
      return res.status(403).json({ error: "Unauthorized" });

    const users = await User.find({}, 'email acceptedSkillSwaps');

    let allAcceptedRequests = [];

    users.forEach(user => {
      user.acceptedSkillSwaps.forEach(request => {
        allAcceptedRequests.push({
          recipientEmail: user.email,
          ...request
        });
      });
    });

    res.status(200).json(allAcceptedRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch accepted swap requests" });
  }
};

const viewAcceptedRequestsForUser = async (req, res) => {
  try {
    if (!req.user || !req.user.isAdmin)
      return res.status(403).json({ error: "Unauthorized" });

    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json(user.acceptedSkillSwaps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user's accepted swap requests" });
  }
};

const banUser = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: "No user logged in" });
        if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });

        const { userId } = req.params;
        const { reason } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Mark user as banned
        user.isBanned = true;
        user.banReason = reason || "No reason provided";
        await user.save();

        res.status(200).json({
            message: "User banned successfully",
            user: user._id,
            reason: user.banReason
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to ban user" });
    }
};

const unbanUser = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: "No user logged in" });
        if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });

        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (!user.isBanned) {
            return res.status(400).json({ error: "User is not currently banned" });
        }

        // Unban user
        user.isBanned = false;
        user.banReason = null;
        await user.save();

        res.status(200).json({
            message: "User unbanned successfully",
            user: user._id
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to unban user" });
    }
};

const adminSignupUser = async (req, res) => {
    const { email, password, name, isAdmin } = req.body;

    try {
        // Check if logged-in user is admin
        if (!req.user) return res.status(401).json({ error: "No user logged in" });
        if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });

        const user = await User.adminSignup(email, password, name, isAdmin);
        res.status(200).json({
            message: "User created successfully",
            userId: user._id,
            email: user.email,
            isAdmin: user.isAdmin
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserDetailsByEmail = async (req, res) => {
    try {
        if (!req.user) return res.status(401).json({ error: "No user logged in" });
        if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });

        const { email } = req.params;

        const user = await User.findOne({ email }).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user details" });
    }
};


const sendAnnouncement = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No user logged in" });
    if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "No message provided" });

    // Remove old announcement if needed (optional)
    await Announcement.deleteMany();

    // Save new one
    await Announcement.create({ message });

    res.status(200).json({ message: "Announcement broadcasted to homepage." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send announcement" });
  }
};

const getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findOne().sort({ createdAt: -1 });
    if (!announcement) return res.status(200).json({ message: "" });

    const now = new Date();
    const diff = now - new Date(announcement.createdAt);

    if (diff > 24 * 60 * 60 * 1000) { // 24 hours
      // Expired: delete it and return empty
      await Announcement.deleteMany(); // clear old announcements
      return res.status(200).json({ message: "" });
    }

    res.status(200).json({ message: announcement.message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch announcement" });
  }
};


module.exports = {
    viewAllRequests,
    banUser
};
