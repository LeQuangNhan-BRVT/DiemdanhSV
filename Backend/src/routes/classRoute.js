// routes/classRoutes.js
const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Áp dụng middleware bảo vệ và giới hạn quyền cho tất cả các route quản lý Class
// Chỉ Admin và Teacher mới được quản lý Class và Schedule
router.use(protect, restrictTo('admin', 'teacher'));

// --- Routes cho Class ---
router.post('/', classController.createClass);
router.get('/', classController.getAllClasses);
router.get('/:id', classController.getClassById);
// router.put('/:id', classController.updateClass); // Thêm nếu cần
// router.delete('/:id', classController.deleteClass); // Thêm nếu cần

// --- Routes thêm/xóa Student khỏi Class ---
router.post('/:classId/students/:studentId', classController.addStudentToClass);
router.delete('/:classId/students/:studentId', classController.removeStudentFromClass);


// Tạo lịch học mới cho lớp :classId
router.post('/:classId/schedules', classController.createSchedule);
// Lấy tất cả lịch học của lớp :classId
router.get('/:classId/schedules', classController.getClassSchedules);
// Cập nhật lịch học :scheduleId của lớp :classId
router.put('/:classId/schedules/:scheduleId', classController.updateSchedule);
// Xóa lịch học :scheduleId của lớp :classId
router.delete('/:classId/schedules/:scheduleId', classController.deleteSchedule);


module.exports = router;