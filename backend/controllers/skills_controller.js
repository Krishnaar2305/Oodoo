const User = require("../models/userModel");

const getskills_info = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: No user logged in" });
    }

    try {
        // Fetch only the required fields for all users
        const users = await User.find().select("name wantedSkills availability");

        // Format and return
        const result = users.map(user => ({
            name: user.name,
            wantedSkills: user.wantedSkills,
            availability: user.availability,
            rating: user.ratings
        }));

        res.status(200).json({ users: result });
    } catch (error) {
        console.error("❌ Error in getskills_info:", error);
        res.status(500).json({ error: "Server error while fetching skill info" });
    }
};

const request_skill = async (req, res) => {
    const { email: targetEmail, offeredSkill, wantedSkill, message } = req.body;

    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: No user logged in" });
    }

    try {
        const targetUser = await User.findOne({ email: targetEmail });
        if (!targetUser) {
            return res.status(404).json({ error: "Target user not found" });
        }

        const requesterEmail = req.user.email;

        // Prevent duplicate requests from same requester for same swap
        const alreadyRequested = targetUser.pendingSkillSwaps.some(
            swap =>
                swap.userEmail === requesterEmail &&
                swap.offeredSkill === offeredSkill &&
                swap.wantedSkill === wantedSkill
        );

        if (!alreadyRequested) {
            targetUser.pendingSkillSwaps.push({
                userEmail: requesterEmail,
                offeredSkill,
                wantedSkill
            });
        }

        // Add/update message for the requester
        const messageEntry = `Offered: ${offeredSkill}, Wanted: ${wantedSkill}, Message: ${message}`;
        targetUser.pendingSkillSwaps_messages.set(requesterEmail, messageEntry);

        await targetUser.save();

        res.status(200).json({ message: "Skill swap request sent successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error while requesting skill" });
    }
};

const User = require("../models/userModel");

const skill_swap_accept_reject = async (req, res) => {
    const { requesterEmail, offeredSkill, wantedSkill, action } = req.body;

    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: No user logged in" });
    }

    if (!["accept", "reject"].includes(action)) {
        return res.status(400).json({ error: "Invalid action. Must be 'accept' or 'reject'." });
    }

    try {
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const pendingIndex = currentUser.pendingSkillSwaps.findIndex(
            (swap) =>
                swap.userEmail === requesterEmail &&
                swap.offeredSkill === offeredSkill &&
                swap.wantedSkill === wantedSkill
        );

        if (pendingIndex === -1) {
            return res.status(404).json({ error: "Matching pending skill swap not found" });
        }

        const request = currentUser.pendingSkillSwaps[pendingIndex];

        // Remove from pending list
        currentUser.pendingSkillSwaps.splice(pendingIndex, 1);
        currentUser.pendingSkillSwaps_messages.delete(requesterEmail);

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
        console.error(err);
        res.status(500).json({ error: "Server error while processing skill swap decision" });
    }
};

const saveSkillsInfo = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: No user logged in" });
    }

    const { skills, wantedSkills, availability, location, public: profileVisibility } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ error: "User not found" });

        // Completely replace the existing values
        user.skills = skills || [];
        user.wantedSkills = wantedSkills || [];
        user.availability = availability || [];
        user.location = location || "";
        user.public = profileVisibility !== undefined ? profileVisibility : true;

        await user.save();

        res.status(200).json({
            message: "User skills and info replaced successfully",
            user: {
                skills: user.skills,
                wantedSkills: user.wantedSkills,
                availability: user.availability,
                location: user.location,
                public: user.public
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Error saving skill info", details: err.message });
    }
};

module.exports = {
    getskills_info,
    request_skill,
    skill_swap_accept_reject,
    saveSkillsInfo
};
