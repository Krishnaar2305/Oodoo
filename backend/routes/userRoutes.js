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

const {requireAuth,
    requireSameUserAuth
} = require('../middleware/requireAuth');
const {getskills_info,request_skill,skill_swap_accept_reject,saveSkillsInfo}=require('../controllers/skills_controller')
const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);
// protected route for getting logged-in user details
router.get('/details', requireAuth, getDetails);
router.get('/skills',requireAuth,getskills_info);
router.post('/request-skill', requireAuth, request_skill);
router.post('/skill-swap-action', requireAuth, skill_swap_accept_reject)
router.post('/save-skills', requireSameUserAuth, saveSkillsInfo);

module.exports = router;
