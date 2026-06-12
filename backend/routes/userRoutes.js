const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController');

let userController = require('../controllers/userController');

const router = express.Router();

// **
// @route   POST /api/users/login
// Login for user
router.post('/login', loginUser);

// **
// @route POST /api/users/signup
// Sign up or register user
router.post('/signup', registerUser);

// **
// @route GET /api/users/user/:id
// Retrieve user's profile by userID
router.get('/user/:id', userController.getUserProfile);

// **
// @route PUT /api/users/update/:id
// Update the user profile's data
router.put('/update/:id', userController.updateUser);

// **
// @route GET /api/users/:id
// Get a user by userID
router.get('/:id', userController.getUser);

module.exports = router;