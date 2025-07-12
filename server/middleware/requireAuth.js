const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
    // get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("email name");

        if (!user) return res.status(404).json({ error: "User not found" });

        req.user = user;  // attach user details to request
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};


const requireSameUserAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select("email name");

        if (!user) return res.status(404).json({ error: "User not found" });

        // Ensure identity match – expects :userId param or req.body.userId
        const targetId = req.params.userId || req.body.userId || req.query.userId;
        if (targetId && decoded._id !== targetId) {
            return res.status(403).json({ error: "Forbidden: User identity mismatch" });
        }

        req.user = user; // attach verified user
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = {requireAuth,
    requireSameUserAuth
};
