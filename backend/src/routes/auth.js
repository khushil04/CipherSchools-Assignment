const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.post('/change-password', authenticateToken, changePassword);
router.post('/logout', authenticateToken, logout);

module.exports = router;

// // Validation middleware
// const validateRegistration = (req, res, next) => {
//   const { username, email, password } = req.body;
  
//   if (!username || !email || !password) {
//     return res.status(400).json({
//       success: false,
//       message: 'Username, email, and password are required'
//     });
//   }
  
//   if (username.length < 3) {
//     return res.status(400).json({
//       success: false,
//       message: 'Username must be at least 3 characters long'
//     });
//   }
  
//   if (password.length < 6) {
//     return res.status(400).json({
//       success: false,
//       message: 'Password must be at least 6 characters long'
//     });
//   }
  
//   const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
//   if (!emailRegex.test(email)) {
//     return res.status(400).json({
//       success: false,
//       message: 'Please enter a valid email address'
//     });
//   }
  
//   next();
// };

// const validateLogin = (req, res, next) => {
//   const { identifier, password } = req.body;
  
//   if (!identifier || !password) {
//     return res.status(400).json({
//       success: false,
//       message: 'Email/username and password are required'
//     });
//   }
  
//   next();
// };

// // Public routes
// router.post('/register', validateRegistration, register);
// router.post('/login', validateLogin, login);

// // Protected routes (require authentication)
// router.get('/profile', authenticateToken, getProfile);
// router.put('/profile', authenticateToken, updateProfile);
// router.put('/change-password', authenticateToken, changePassword);
// router.post('/logout', authenticateToken, logout);

// module.exports = router;
