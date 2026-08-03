//cors-cross-origin-resource-sharing
//maintains client-server communication

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const tutorSearchRoutes = require('./routes/tutor.search.routes');
const bookingRoutes = require('./routes/booking.routes');

const app = express();

//app.use(cors());
// sprint 3 - use environment variable for CORS origin to support team dev and production
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",  // sprint 3 - configurable CORS origin
    credentials: true,
  })
);
app.use(express.json());//to parse JSON bodies - works like a translator

app.use('/auth', authRoutes);//traffic controller for auth routes
app.use('/api', tutorSearchRoutes);
app.use('/api', bookingRoutes);

//afra-sprint3
app.use('/dashboard', require('./routes/dashboard.routes'));
console.log('Dashboard routes mounted');  // temporary sprint 3 debug

app.get('/test', (req, res) => {
  res.json({ message: 'server works' });
});

module.exports = app; 