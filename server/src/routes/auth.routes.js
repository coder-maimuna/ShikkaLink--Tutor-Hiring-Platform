const router = require('express').Router();

const {
  registerStudent,
  registerTutor,
  login
} = require('../controllers/auth.controller');

router.post('/register/student', registerStudent);

router.post('/register/tutor', registerTutor);

router.post('/login', login);

module.exports = router;