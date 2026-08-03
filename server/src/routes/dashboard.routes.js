//sprint 3 afra---
console.log("dashboard.routes.js loaded");
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const dashCtrl = require('../controllers/dashboard.controller');
const adminCtrl = require('../controllers/admin.controller');

// diagnostic public endpoints (bypass auth) - sprint 3
router.get('/ping', (req, res) => res.json({ ok: true, route: '/dashboard/ping' }));
router.get('/student-test', (req, res) => res.json({ ok: true, route: '/dashboard/student-test' }));

// Public routes - NO auth needed (students can search without login)
router.get('/tutors/search', require('../controllers/tutor.search.controller').searchTutors);

router.get('/student', authMiddleware, roleMiddleware('student'), dashCtrl.studentDashboard);
router.get('/tutor',   authMiddleware, roleMiddleware('tutor'),   dashCtrl.tutorDashboard);
router.get('/admin',   authMiddleware, roleMiddleware('admin'),   dashCtrl.adminDashboard);

// Tutor profile detail routes
router.get('/tutor/profile/details', authMiddleware, roleMiddleware('tutor'), dashCtrl.getTutorProfileDetails);
router.post('/tutor/profile/education', authMiddleware, roleMiddleware('tutor'), dashCtrl.saveTutorEducation);
router.post('/tutor/profile/preference', authMiddleware, roleMiddleware('tutor'), dashCtrl.saveTutorPreference);
router.post('/tutor/profile/experience', authMiddleware, roleMiddleware('tutor'), dashCtrl.saveTutorExperience);
router.post('/tutor/profile/documents', authMiddleware, roleMiddleware('tutor'), dashCtrl.saveTutorDocuments);
router.post('/tutor/request-verification', authMiddleware, roleMiddleware('tutor'), dashCtrl.requestVerification);

// sprint 3 - NEW: Admin action endpoints
router.post('/admin/verify/:user_id', authMiddleware, roleMiddleware('admin'), dashCtrl.verifyTutor);
router.post('/admin/reject/:user_id', authMiddleware, roleMiddleware('admin'), dashCtrl.rejectTutor);

// Admin dashboard routes
router.get('/admin', authMiddleware, roleMiddleware('admin'), adminCtrl.adminDashboard);
router.get('/admin/tutors', authMiddleware, roleMiddleware('admin'), adminCtrl.getAllTutors);
router.get('/admin/students', authMiddleware, roleMiddleware('admin'), adminCtrl.getAllStudents);
router.get('/admin/pending-tutors', authMiddleware, roleMiddleware('admin'), adminCtrl.getPendingTutors);
router.get('/admin/tutor/:tutor_id', authMiddleware, roleMiddleware('admin'), adminCtrl.getTutorFullProfile);
router.post('/admin/tutor/:tutor_id/verify', authMiddleware, roleMiddleware('admin'), adminCtrl.verifyTutor);
router.post('/admin/tutor/:tutor_id/reject', authMiddleware, roleMiddleware('admin'), adminCtrl.rejectTutor);
router.get('/admin/users', authMiddleware, roleMiddleware('admin'), adminCtrl.getAllUsers);
router.post('/admin/user/:user_id/suspend', authMiddleware, roleMiddleware('admin'), adminCtrl.suspendUser);
router.post('/admin/user/:user_id/activate', authMiddleware, roleMiddleware('admin'), adminCtrl.activateUser);

// Student profile routes
router.put('/student/profile/personal', authMiddleware, roleMiddleware('student'), dashCtrl.updateStudentProfile);
router.put('/tutor/profile/personal', authMiddleware, roleMiddleware('tutor'), dashCtrl.updateTutorPersonal);

module.exports = router;