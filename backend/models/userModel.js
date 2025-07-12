const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const schema = mongoose.Schema;

// User Schema
const userSchema = new schema({
    name: { type: String },  // optional, not unique
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String },
    profilePhoto: { type: String },
    skills: { type: Array, default: [] },
    wantedSkills: { type: Array, default: [] },
    availability: { type: Array, default: [] },
    pendingSkillSwaps: {
        type: [
          {
            userEmail: { type: String, required: true },
            offeredSkill: { type: String, required: true },
            wantedSkill: { type: String, required: true }
          }
        ],
        default: []
    },
    pendingSkillSwaps_messages: {
        type: Map,
        of: String, 
        default: {}
    },      
    acceptedSkillSwaps: { type: Array, default: [] },
    ratings: { type: Array, default: [] },
    public: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

// STATIC METHODS

// Signup
userSchema.statics.signup = async function (email, password, name = "") {
    if (!email || !password) throw Error("All fields must be filled");

    if (!validator.isEmail(email)) throw Error("Invalid email format");
    if (!validator.isStrongPassword(password)) throw Error("Weak Password");

    const emailExists = await this.findOne({ email });
    if (emailExists) throw Error('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ email, password: hash, name });
    return user;
};


// Login
userSchema.statics.login = async function (email, password) {
    if (!email || !password) throw Error("All fields must be filled");

    const user = await this.findOne({ email });
    if (!user) throw Error("Email not registered");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw Error("Incorrect password");

    return user;
};


// Reset Password
userSchema.statics.resetPassword = async function (email, newPassword, id) {
    if (!email || !newPassword) throw Error('All fields must be filled');
    if (!validator.isStrongPassword(newPassword)) throw Error('Weak Password');

    const user = await this.findOne({ email });
    if (!user) throw Error('No such email registered');

    if (user._id.toString() !== id) throw Error('Invalid reset link');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    user.password = hash;
    await user.save();

    return user;
};

module.exports = mongoose.model('User', userSchema);
