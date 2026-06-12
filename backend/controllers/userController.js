const bcrypt = require('bcryptjs');
const User = require('../models/user');
const axios = require('axios');

// Register new user
// POST /api/users/signup
exports.registerUser = async (req, res) => {
    try {
        console.log('\n Incoming request body: ', req.body);
        const {
             username, 
             firstName,
             lastName,
             email,
             password,
        } = req.body;

        console.log('Request Body: ', req.body);

        if (!username || !email || !password ) {
            console.log('Validation failed. Missing required fields.');
            return res.status(400).json({ message: 'Missing required fields' });
        }

        console.log('Checking if the user exists ... ');
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        console.log('User Exists: ', userExists);

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' })
        }


        console.log('Hashing password ... ');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log('Hashed Password: ', hashedPassword);

        console.log('Creating new user object ... \n');
        const newUser = new User({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        console.log('New User Object created: \n', newUser);

        console.log('Saving new user to database ... ');
        await newUser.save();
        console.log('User saved successfully!');

        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
        });
    } catch (error) {
        console.error('Error occurred: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login endpoint
// @route  POST /api/users/login

exports.loginUser = async (req, res) => {
    console.log("Start logging");

    const { username, password } = req.body;

    try {
        console.log('Login attempt: ', username, password);

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match: ', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Respond with success
        res.status(200).json({
            message: 'Login successful', user: {
                id: user._id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Server Error: ', error);
        res.status(500).json({ message: 'Server error', error});
    }
}

// Get user Profile
// @route   GET /api/users/:id

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userProfile = user.toObject();

        res.status(200).json(userProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

// Get user details by ID
// @route   GET /api/users/:id

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        console.log(user);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}


// Updare user details
// @route    PUT /api/users/update/:id

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing' });
        }

        const { username, firstName, lastName, notepad } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (username) user.username = username;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (notepad !== undefined) user.notepad = notepad;

        await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Error updating user: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};

