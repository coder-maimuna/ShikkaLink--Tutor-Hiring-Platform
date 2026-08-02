const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/tutor.search.controller');

// Public - no auth middleware needed
router.get('/tutors/search', ctrl.searchTutors);
router.get('/tutors/:tutor_id', ctrl.getTutorDetails);

module.exports = router;
