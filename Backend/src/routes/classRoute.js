// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Áp dụng middleware bảo vệ và giới hạn quyền cho tất cả các route trong file này
router.use(protect, restrictTo('admin', 'teacher'));

// @route   POST /api/classes
// @desc    Create a new class
// @access  Private (Admin, Teacher)
router.post('/', classController.createClass);

// @route   GET /api/classes
// @desc    Get all classes
// @access  Private (Admin, Teacher)
router.get('/', classController.getAllClasses);

// @route   GET /api/classes/:id
// @desc    Get a single class by ID
// @access  Private (Admin, Teacher)
router.get('/:id', classController.getClassById);

// @route   POST /api/classes/:classId/students/:studentId
// @desc    Add a student to a class
// @access  Private (Admin, Teacher)
router.post('/:classId/students/:studentId', classController.addStudentToClass);

// @route   DELETE /api/classes/:classId/students/:studentId
// @desc    Remove a student from a class
// @access  Private (Admin, Teacher)
router.delete('/:classId/students/:studentId', classController.removeStudentFromClass);

// Thêm các routes khác (PUT /:id, DELETE /:id)

module.exports = router;