//sprint 3 afra---
console.log("dashboard.routes.js loaded");
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const dashCtrl = require('../controllers/dashboard.controller');

// diagnostic public endpoints (bypass auth) - sprint 3
router.get('/ping', (req, res) => res.json({ ok: true, route: '/dashboard/ping' }));
router.get('/student-test', (req, res) => res.json({ ok: true, route: '/dashboard/student-test' }));

router.get('/student', authMiddleware, roleMiddleware('student'), dashCtrl.studentDashboard);
router.get('/tutor',   authMiddleware, roleMiddleware('tutor'),   dashCtrl.tutorDashboard);
router.get('/admin',   authMiddleware, roleMiddleware('admin'),   dashCtrl.adminDashboard);

// sprint 3 - NEW: Admin action endpoints
router.post('/admin/verify/:user_id', authMiddleware, roleMiddleware('admin'), dashCtrl.verifyTutor);
router.post('/admin/reject/:user_id', authMiddleware, roleMiddleware('admin'), dashCtrl.rejectTutor);

module.exports = router;