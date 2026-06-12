const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const fs = require('fs');

const path = require('path');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

exports.allVlogs = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)){
            return res.status(400).json({ message: 'Invalid user ID' });
        };

        const user = await User.findById(userId).populate('vlogs');
       
        if(!user) {
            return res.status(404).json({ message: 'Vlog not found' });
        };

        if (Array.isArray(user.vlogs)) {
            return res.status(200).json(user.vlogs); // Send the vlogs array as the response
        } else {
            return res.status(500).json({ message: 'User vlogs data is corrupted or empty' });
        }

    } catch (error) {
        console.log('Server error: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAllVlogs = async (req, res) => {
    try {
        const users = await User.find({ 'vlogTitle': { $exists: true}});

        if (!users.length) {
            return res.status(404).json({ message: 'No vlogs available'});
        }

        const allVlogs = users.flatMap(user => user);

        console.log("Log???", allVlogs);

        res.status(200).json(allVlogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addVlog = async (req, res) => {
    try {

        const userId = req.params.id;
        const { vlogTitle, description } = req.body;
        const vlogImage = req.file ? `/api/uploads/${req.file.filename}` : null;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newVlog = {
            vlogTitle,
            description,
            vlogImage,
        };

        console.log('\nnewVlog: ', newVlog);

        user.vlogs.push(newVlog);

        await user.save();
        
        res.status(200).json({
            message: 'Vlog successfully added',
            user,
        });
        console.log('Vlog successfully added');
    } catch(error) {
        console.error('Error adding Vlog: ', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getVlogById = async (req, res) => {
    const { vlogId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(vlogId)){
            return res.status(400).json({ message: 'Invalid vlog ID' });
        };

        const user = await User.findOne({ 'vlogs._id': vlogId }, { 'vlogs.$': 1 });

        console.log('User found: ', user);
        
        if(!user) {
            return res.status(404).json({ message: 'Vlog not found' });
        };

        const vlog = user.vlogs[0];
        console.log('Vlog found: ', vlog);
        res.status(200).json(vlog);
    } catch (error) {
        console.error('Error fetching vlog details: ', error);
        res.status(500).json({ message: 'Error fetching vlog data: ', error });
    };
};

exports.deleteVlog = async (req, res) => { 
    try {
        const userId = req.params.id;
        const vlogId = req.params.vlogId;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'invalid user Id' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const vlogIndex = user.vlogs.findIndex(vlog => vlog._id.toString() === vlogId);

        if (vlogIndex === -1) {
            return res.status(404).json({ message: 'Vlog not found' });
        }

        user.vlogs.splice(vlogIndex, 1);
        await user.save();

        res.status(200).json({
            message: 'Vlog successfully deleted',
            user,
        });
    } catch (error) {
        console.error('Error deleting vlog: ', error);
        res.status(500).json({ message: 'Server error' });
    }
}