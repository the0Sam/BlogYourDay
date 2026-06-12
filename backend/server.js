const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const vlogRoutes = require('./routes/vlogRoutes');

const app = express();
const PORT = process.env.PORT ||  5000;
const MONGO_URL = process.env.MONGO_URL ;

app.use(
    cors({
        origin: [
            "https://blogyourday-1.onrender.com/"
        ],
        credentials: true
    })
);

mongoose.connect(`${MONGO_URL}`)
    .then(() => console.log('Connected to MongoDB.'))
    .catch(err => console.error('Connection error: ', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/vlogs', vlogRoutes);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
