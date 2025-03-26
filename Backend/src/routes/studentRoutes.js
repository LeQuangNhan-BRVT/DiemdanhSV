// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Áp dụng middleware bảo vệ và giới hạn quyền cho các route xem thông tin sinh viên
router.use(protect, restrictTo('admin', 'teacher'));

// @route   GET /api/students
// @desc    Get all students
// @access  Private (Admin, Teacher)
router.get('/', studentController.getAllStudents);

// @route   GET /api/students/:id
// @desc    Get a single student by ID
// @access  Private (Admin, Teacher)
router.get('/:id', studentController.getStudentById);

// Không nên có route POST /api/students ở đây

module.exports = router;