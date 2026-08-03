const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const bookingCtrl = require('../controllers/booking.controller');

// Student routes - require student authentication
router.post('/sessions', authMiddleware, roleMiddleware(['student']), bookingCtrl.createSession);
router.get('/sessions', authMiddleware, roleMiddleware(['student']), bookingCtrl.getStudentSessions);

// Tutor routes - require tutor authentication
router.get('/tutor/sessions', authMiddleware, roleMiddleware(['tutor']), bookingCtrl.getTutorSessions);

// Delete route - requires authentication (student or tutor)
router.delete('/sessions/:session_id', authMiddleware, bookingCtrl.deleteSession);

module.exports = router;
