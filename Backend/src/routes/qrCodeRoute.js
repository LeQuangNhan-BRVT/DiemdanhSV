const express = require('express');
const router = express.Router();
const qrCodeController = require('../controllers/qrCodeController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// Tạo QR code cho buổi học
router.post('/session/:sessionId', verifyToken, checkRole(['admin', 'teacher']), qrCodeController.generateSessionQR);

// Tạo QR code cho sinh viên
router.post('/student', verifyToken, qrCodeController.generateStudentQR);

// Xác minh QR code
router.post('/verify/:encryptedData', verifyToken, qrCodeController.verifyQR);

module.exports = router;