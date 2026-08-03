const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tutor.search.controller');
const profileCtrl = require('../controllers/tutor-profile.controller');

// Public - no auth middleware needed
router.get('/tutors/search', ctrl.searchTutors);
router.get('/tutors/:tutor_id', ctrl.getTutorDetails);

// Public tutor profile endpoint
router.get('/tutor/profile/:tutor_id', profileCtrl.getTutorProfile);

module.exports = router;
