const mongoose = require('mongoose');
const vlogSchema = new mongoose.Schema({
    vlogTitle: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    vlogImage: {
        type: String,
    },
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required.'],
        unique: true,
    },
    firstName: {
        type: String,
        required: [true, 'First Name is required.'],
        unique: false,
    },
    lastName: {
        type: String,
        required : false,
        unique: false,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Email is invalid.'],
    },
    password: {
        type: String,
        required: [true, 'Please enter password.'],
        minlength: 6,
    },
    vlogs: [vlogSchema],
    notepad: {
        type: String,
        default: '',
    },
});

module.exports = mongoose.model('User', userSchema);