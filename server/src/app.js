//cors-cross-origin-resource-sharing
//maintains client-server communication

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());//to parse JSON bodies - works like a translator

app.use('/api/auth', authRoutes);//traffic controller for auth routes
module.exports = app;