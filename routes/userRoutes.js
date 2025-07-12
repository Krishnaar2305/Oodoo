const express = require('express');
const {
    loginUser,
    signupUser,
    forgotPassword,
    resetPassword,
    refreshAccessToken,
    logoutUser,
    getDetails
} = require('../controllers/userController');

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);

// protected route for getting logged-in user details
router.get('/details', requireAuth, getDetails);

module.exports = router;
