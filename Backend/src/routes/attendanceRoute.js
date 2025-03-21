const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/sessions/:classId', verifyToken, attendanceController.getSessionsByClass);
router.post('/sessions', verifyToken, checkRole(['admin', 'teacher']), attendanceController.createSession);
router.get('/session/:sessionId', verifyToken, attendanceController.getAttendanceBySession);
router.put('/:id', verifyToken, checkRole(['admin', 'teacher']), attendanceController.updateAttendance);

module.exports = router;