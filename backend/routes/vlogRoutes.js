const express = require('express');

const { addVlog, getVlogById, deleteVlog, allVlogs } = require('../controllers/vlogController');

const router = express.Router();
const fs = require('fs');
const path = require('path');
const upload = require('../middleware/multer');

// **
// @route   GET /api/vlogs/allVlogs/:id
// retrieve all vlogs under an user
router.get('/allVlogs/:id', allVlogs);

// **
// @route   POST /api/vlogs/users/:id/vlogs
// add the vlog entry of user by userId
router.post('/users/:id/vlogs', upload.single('vlogImage'), addVlog);

// **
// @route   GET /api/vlogs/:vlogId
// get the details of specific vlog entry by vlogId
router.get('/:vlogId', getVlogById);

// **
// @route   DELETE /api/vlogs/users/:id/vlogs/:vlogId
// Delete the vlog for a specific user
router.delete('/users/:id/vlogs/:vlogId', deleteVlog);

module.exports = router;
