const User = require("../models/userModel");

// Fetch skills info for all users
const getskills_info = async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: "Unauthorized: No user logged in" });

    try {
        const users = await User.find().select(
            "name email location skills wantedSkills availability ratings"
        );

        const result = users.map((user) => ({
            name: user.name,
            email: user.email,
            location: user.location,
            skills: user.skills,
            wantedSkills: user.wantedSkills,
            availability: user.availability,
            rating: user.ratings,
        }));

        res.status(200).json({ users: result });
    } catch (error) {
        console.error("❌ Error in getskills_info:", error);
        res.status(500).json({ error: "Server error while fetching skill info" });
    }
};

const request_skill = async (req, res) => {
    const { targetEmail, offeredSkill, wantedSkill, message } = req.body;

    if (!req.user) return res.status(401).json({ error: "Unauthorized: No user logged in" });

    try {
        // Find target user by email and get their _id
        const targetUser = await User.findOne({ email: targetEmail });
        if (!targetUser) return res.status(404).json({ error: "Target user not found" });

        const requesterEmail = req.user.email;

        // Check for existing request
        const alreadyRequested = targetUser.pendingSkillSwaps.some(
            swap => swap.userEmail === requesterEmail && swap.offeredSkill === offeredSkill && swap.wantedSkill === wantedSkill
        );

        // If not already requested, add it
        if (!alreadyRequested) {
            targetUser.pendingSkillSwaps.push({
                userEmail: requesterEmail,
                offeredSkill,
                wantedSkill
            });
        }

        // Use requester _id as safe message key (since Mongoose Map doesn't like emails)
        const requesterUser = await User.findOne({ email: requesterEmail }).select('_id');
        if (!requesterUser) return res.status(404).json({ error: "Requesting user not found" });

        const requesterId = requesterUser._id.toString(); // safe key for Mongoose Map

        const messageEntry = `Offered: ${offeredSkill}, Wanted: ${wantedSkill}, Message: ${message}`;
        targetUser.pendingSkillSwaps_messages.set(requesterId, messageEntry);

        await targetUser.save();

        res.status(200).json({ message: "Skill swap request sent successfully." });

    } catch (err) {
        console.error("❌ Error in request_skill:", err);
        res.status(500).json({ error: "Internal server error while requesting skill" });
    }
};


// Accept / Reject a skill swap
const skill_swap_accept_reject = async (req, res) => {
    const { requesterEmail, offeredSkill, wantedSkill, action } = req.body;

    if (!req.user) return res.status(401).json({ error: "Unauthorized: No user logged in" });
    if (!["accept", "reject"].includes(action)) return res.status(400).json({ error: "Invalid action" });

    try {
        // Fetch current logged-in user by _id
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) return res.status(404).json({ error: "User not found" });

        // Find swap request by requester email, offered & wanted skill
        const pendingIndex = currentUser.pendingSkillSwaps.findIndex(
            swap => swap.userEmail === requesterEmail && swap.offeredSkill === offeredSkill && swap.wantedSkill === wantedSkill
        );
        if (pendingIndex === -1)
            return res.status(404).json({ error: "No matching pending swap found" });

        // Remove from pendingSkillSwaps
        currentUser.pendingSkillSwaps.splice(pendingIndex, 1);

        // Find requester _id for message map key
        const requesterUser = await User.findOne({ email: requesterEmail }).select('_id');
        if (!requesterUser) return res.status(404).json({ error: "Requesting user not found" });

        const requesterId = requesterUser._id.toString();

        // Delete message entry from Map using requester _id as key
        currentUser.pendingSkillSwaps_messages.delete(requesterId);

        // If accepted, add to acceptedSkillSwaps
        if (action === "accept") {
            currentUser.acceptedSkillSwaps.push({
                userEmail: requesterEmail,
                offeredSkill,
                wantedSkill
            });
        }

        await currentUser.save();

        res.status(200).json({ message: `Request ${action}ed successfully` });

    } catch (err) {
        console.error("❌ Error in skill_swap_accept_reject:", err);
        res.status(500).json({ error: "Error processing skill swap decision" });
    }
};


const saveSkillsInfo = async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized: No user logged in" });

    const {
        name, // ✅ new
        skills, skillsOffered, wantedSkills, skillsWanted,
        availability, location, visibility, public: profileVisibility
    } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (name) user.name = name;  // ✅ update name if provided
        user.skills = skills || skillsOffered || [];
        user.wantedSkills = wantedSkills || skillsWanted || [];
        user.availability = availability || [];
        user.location = location || "";
        user.public = visibility ? (visibility === "public") : (profileVisibility !== undefined ? profileVisibility : true);

        await user.save();

        res.status(200).json({
            message: "User skills and info updated successfully",
            user: {
                name: user.name,
                skills: user.skills,
                wantedSkills: user.wantedSkills,
                availability: user.availability,
                location: user.location,
                public: user.public
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error saving skill info", details: err.message });
    }
};


// Search user by email
const searchByEmail = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email }).select("name email wantedSkills availability");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ user });
};

const searchBySkill = async (req, res) => {
    const skillQuery = req.query.skill;
    if (!skillQuery) return res.status(400).json({ error: "Skill is required" });

    const skills = skillQuery.split(',').map(s => s.trim());
    const users = await User.find({
        $or: [
            { skills: { $in: skills } },
            { wantedSkills: { $in: skills } }
        ]
    }).select("name email wantedSkills availability");

    res.status(200).json({ users });
};


module.exports = {
    getskills_info,
    request_skill,
    skill_swap_accept_reject,
    saveSkillsInfo,
    searchByEmail,
    searchBySkill
};
