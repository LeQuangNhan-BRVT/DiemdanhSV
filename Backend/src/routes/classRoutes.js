// Route cho giáo viên tùy chỉnh thời gian điểm danh
router.put('/schedule/attendance-time', 
    protect, 
    restrictTo('admin', 'teacher'), 
    attendanceController.updateAttendanceTime
); 