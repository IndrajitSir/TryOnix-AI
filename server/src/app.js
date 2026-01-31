require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');

// Database Connection
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('TryOnix API is running...');
});

app.use('/auth', authRoutes);
app.use('/tryon', require('./routes/tryOnRoutes'));


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
