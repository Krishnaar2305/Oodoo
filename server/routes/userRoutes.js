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

const {
  getskills_info,
  request_skill,
  skill_swap_accept_reject,
  saveSkillsInfo,
  searchByEmail,
  searchBySkill
} = require('../controllers/skills_controller');


const {
  requireAuth,
  requireSameUserAuth
} = require('../middleware/requireAuth');

const router = express.Router();

// Auth Routes
router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/refresh-token', refreshAccessToken);
router.post('/logout', logoutUser);

// User Info
router.get('/me', requireAuth, getDetails);

// Skill-related Routes
router.get('/skills', requireAuth, getskills_info);
router.post('/request-skill', requireAuth, request_skill);
router.post('/skill-swap-action', requireAuth, skill_swap_accept_reject);
router.post('/save-skills', requireSameUserAuth, saveSkillsInfo);
router.get('/search/email', requireAuth, searchByEmail);
router.get('/search/skill', requireAuth, searchBySkill);
module.exports = router;
