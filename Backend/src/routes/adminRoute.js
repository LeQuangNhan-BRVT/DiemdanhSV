// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// @route   POST /api/admin/users
// @desc    Create a new user (student, teacher, or admin)
// @access  Private (Admin only)
router.post('/users', protect, restrictTo('admin'), adminController.createUser);
// Route test
router.get('/teachers', protect, restrictTo('admin'), adminController.getTeachers);
// Thêm các routes khác cho Admin nếu cần (GET users, PUT user, DELETE user)
router.route('/teachers/:id')
  .put(protect, restrictTo('admin'), adminController.updateTeacher)
  .delete(protect, restrictTo('admin'), adminController.deleteTeacher);
module.exports = router;