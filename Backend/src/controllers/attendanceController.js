// controllers/attendanceController.js
const QRCode = require('qrcode');
const db = require('../models');
const Attendance = db.Attendance;
const Class = db.Class;
const Student = db.Student;
const ClassSchedule = db.ClassSchedule;
const { Op } = require('sequelize');

// Tạo mã QR cho buổi học
exports.generateQR = async (req, res) => {
    try {
        const { classId, scheduleId } = req.body;

        if (!classId || !scheduleId) {
            return res.status(400).json({ error: "classId và scheduleId là bắt buộc" });
        }

        // Kiểm tra quyền truy cập
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Bạn không có quyền tạo mã QR' });
        }

        // Kiểm tra lớp học và buổi học
        const classInfo = await db.Class.findOne({
            where: { id: classId }
        });

        if (!classInfo) {
            return res.status(404).json({ error: 'Không tìm thấy lớp học' });
        }

        // Kiểm tra nếu là giáo viên thì phải là giáo viên của lớp đó
        if (req.user.role === 'teacher' && req.user.id !== classInfo.teacherId) {
            return res.status(403).json({ error: 'Bạn không phải là giáo viên của lớp này' });
        }

        const schedule = await db.ClassSchedule.findOne({
            where: { 
                id: scheduleId,
                classId: classId
            }
        });

        if (!schedule) {
            return res.status(404).json({ error: 'Không tìm thấy buổi học' });
        }

        // Tạo QR data với timestamp hiện tại
        const timestamp = Date.now();
        const qrData = JSON.stringify({
            classId,
            scheduleId,
            timestamp
        });

        // Tạo QR code
        QRCode.toDataURL(qrData, (err, url) => {
            if (err) {
                console.error("QR Generation Error:", err);
                return res.status(500).json({ error: "Lỗi khi tạo mã QR" });
            }
            res.json({ 
                qrCodeURL: url,
                expiresAt: timestamp + (15 * 60 * 1000) // Hết hạn sau 15 phút
            });
        });

    } catch (error) {
        console.error("generateQR Error:", error);
        res.status(500).json({ error: 'Lỗi server khi tạo mã QR' });
    }
};

// Sinh viên điểm danh
exports.checkIn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { qrData } = req.body;
        const studentUserId = req.user.id;

        if (!qrData) {
            await transaction.rollback();
            return res.status(400).json({ error: "qrData là bắt buộc" });
        }

        // Giải mã QR data
        let decodedData;
        try {
            decodedData = JSON.parse(qrData);
            if (!decodedData || !decodedData.classId || !decodedData.scheduleId || !decodedData.timestamp) {
                throw new Error('Dữ liệu QR không hợp lệ');
            }
        } catch (parseError) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Dữ liệu QR không hợp lệ' });
        }

        const { classId, scheduleId, timestamp } = decodedData;

        // Kiểm tra thời hạn QR code (15 phút)
        const QR_EXPIRY_MS = 15 * 60 * 1000;
        if ((Date.now() - timestamp) > QR_EXPIRY_MS) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Mã QR đã hết hạn' });
        }

        // Kiểm tra sinh viên
        const student = await db.Student.findOne({
            where: { userId: studentUserId },
            transaction
        });

        if (!student) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Không tìm thấy thông tin sinh viên' });
        }

        // Kiểm tra lớp học
        const classInfo = await db.Class.findOne({
            where: { id: classId },
            transaction
        });

        if (!classInfo) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Không tìm thấy lớp học' });
        }

        // Kiểm tra sinh viên có thuộc lớp không thông qua bảng ClassStudent
        const isStudentInClass = await db.ClassStudent.findOne({
            where: {
                classId: classId,
                studentId: student.id
            },
            transaction
        });

        if (!isStudentInClass) {
            await transaction.rollback();
            return res.status(403).json({ error: 'Bạn không thuộc lớp này' });
        }

        // Kiểm tra buổi học
        const schedule = await db.ClassSchedule.findOne({
            where: {
                id: scheduleId,
                classId: classId
            },
            transaction
        });

        if (!schedule) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Không tìm thấy buổi học' });
        }

        // Kiểm tra thời gian điểm danh
        const now = new Date();
        const currentTime = now.toLocaleTimeString('en-US', { 
            hour12: false,
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        // Nếu không có thời gian điểm danh được cài đặt, sử dụng thời gian mặc định
        const startTime = schedule.attendanceStartTime || schedule.startTime;
        const endTime = schedule.attendanceEndTime || schedule.endTime;

        if (currentTime < startTime) {
            await transaction.rollback();
            return res.status(400).json({ 
                error: 'Chưa đến thời gian điểm danh',
                startTime: startTime,
                currentTime: currentTime
            });
        }

        if (currentTime > endTime) {
            await transaction.rollback();
            return res.status(400).json({ 
                error: 'Đã hết thời gian điểm danh',
                endTime: endTime,
                currentTime: currentTime
            });
        }

        // Kiểm tra đã điểm danh chưa
        const existingAttendance = await db.Attendance.findOne({
            where: {
                studentId: student.id,
                scheduleId: scheduleId
            },
            transaction
        });

        if (existingAttendance) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Bạn đã điểm danh buổi học này' });
        }

        // Tạo bản ghi điểm danh
        const attendance = await db.Attendance.create({
            studentId: student.id,
            classId: classId,
            scheduleId: scheduleId,
            status: 'present',
            checkInTime: now
        }, { transaction });

        await transaction.commit();

        res.status(200).json({
            message: 'Điểm danh thành công',
            attendance: {
                id: attendance.id,
                studentId: student.studentId,
                classId: classId,
                scheduleId: scheduleId,
                status: attendance.status,
                checkInTime: attendance.checkInTime
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Lỗi khi điểm danh:', error);
        res.status(500).json({ error: 'Lỗi server khi điểm danh' });
    }
};

//xem lịch sử điểm danh
exports.getStudentHistory = async (req, res) => {
    try {
      const studentUserId = req.user.id;
      //tim thong tin sv
      const student = await Student.findOne({
        where: { userId: studentUserId },
      });
      if (!student) {
        return res.status(404).json({ error: "Khong co sinh vien nay" });
      }
      //lay lich su diem danh
      const attendanceHistory = await Attendance.findAll({
        where: { studentId: student.id },
        include: [
          {
            model: Class,
            as: "classInfo",
            attributes: ["id", "name"],
          },
          {
            model: ClassSchedule,
            as: "scheduleInfo",
            attributes: ["dayOfWeek", "startTime", "endTime"],
          },
        ],
        order: [["date", "DESC"]], //sap xep thoi gian moi nhat
        attributes: ["date", "createdAt"],
      });
      // Format dữ liệu trả về
      const formattedHistory = attendanceHistory.map((record) => ({
        date: record.date,
        checkinTime: record.createdAt,
        className: record.classInfo.name,
        schedule: record.scheduleInfo
          ? {
              dayOfWeek: record.scheduleInfo.dayOfWeek,
              time: `${record.scheduleInfo.startTime} - ${record.scheduleInfo.endTime}`,
            }
          : null,
      }));
  
      res.status(200).json({
        studentId: student.studentId,
        totalAttendance: attendanceHistory.length,
        history: formattedHistory,
      });
    } catch (error) {
      console.error("Get attendance history error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // Lấy lịch sử điểm danh của sinh viên theo lớp cụ thể
  exports.getStudentClassHistory = async (req, res) => {
    try {
      const studentUserId = req.user.id;
      const { classId } = req.params;
  
      // Tìm thông tin sinh viên
      const student = await Student.findOne({
        where: { userId: studentUserId },
      });
  
      if (!student) {
        return res.status(404).json({ error: "Student record not found" });
      }
  
      // Kiểm tra sinh viên có thuộc lớp này không
      const classObj = await Class.findByPk(classId);
      if (!classObj) {
        return res.status(404).json({ error: "Class not found" });
      }
  
      const isStudentInClass = await classObj.hasStudent(student);
      if (!isStudentInClass) {
        return res
          .status(403)
          .json({ error: "You are not enrolled in this class" });
      }
  
      // Lấy tổng số buổi học của lớp
      const totalSessions = await ClassSchedule.count({
        where: { classId },
      });
  
      // Lấy lịch sử điểm danh của lớp này
      const attendanceHistory = await Attendance.findAll({
        where: {
          studentId: student.id,
          classId: classId,
        },
        include: [
          {
            model: ClassSchedule,
            as: "scheduleInfo",
            attributes: ["dayOfWeek", "startTime", "endTime"],
          },
        ],
        order: [["date", "DESC"]],
        attributes: ["date", "createdAt"],
      });
  
      // Format dữ liệu trả về
      const formattedHistory = attendanceHistory.map((record) => ({
        date: record.date,
        checkinTime: record.createdAt,
        schedule: record.scheduleInfo
          ? {
              dayOfWeek: record.scheduleInfo.dayOfWeek,
              time: `${record.scheduleInfo.startTime} - ${record.scheduleInfo.endTime}`,
            }
          : null,
      }));
  
      res.status(200).json({
        className: classObj.name,
        studentId: student.studentId,
        totalSessions: totalSessions,
        attendedSessions: attendanceHistory.length,
        attendanceRate: `${(
          (attendanceHistory.length / totalSessions) *
          100
        ).toFixed(2)}%`,
        history: formattedHistory,
      });
    } catch (error) {
      console.error("Get class attendance history error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

// Giáo viên tùy chỉnh thời gian điểm danh
exports.updateAttendanceTime = async (req, res) => {
    try {
        const { scheduleId, startTime, endTime } = req.body;

        if (!scheduleId || !startTime || !endTime) {
            return res.status(400).json({ error: 'scheduleId, startTime và endTime là bắt buộc' });
        }

        // Kiểm tra quyền truy cập
        if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
            return res.status(403).json({ error: 'Bạn không có quyền tùy chỉnh thời gian điểm danh' });
        }

        // Tìm buổi học
        const schedule = await db.ClassSchedule.findOne({
            where: { id: scheduleId },
            include: [{
                model: db.Class,
                as: 'classInfo'
            }]
        });

        if (!schedule) {
            return res.status(404).json({ error: 'Không tìm thấy buổi học' });
        }

        // Kiểm tra nếu là giáo viên thì phải là giáo viên của lớp đó
        if (req.user.role === 'teacher' && req.user.id !== schedule.classInfo.teacherId) {
            return res.status(403).json({ error: 'Bạn không phải là giáo viên của lớp này' });
        }

        // Kiểm tra định dạng thời gian
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
            return res.status(400).json({ error: 'Định dạng thời gian không hợp lệ (HH:MM:SS)' });
        }

        // Kiểm tra thời gian kết thúc phải sau thời gian bắt đầu
        const startTimeObj = new Date(`2000-01-01T${startTime}`);
        const endTimeObj = new Date(`2000-01-01T${endTime}`);
        if (endTimeObj <= startTimeObj) {
            return res.status(400).json({ error: 'Thời gian kết thúc phải sau thời gian bắt đầu' });
        }

        // Cập nhật thời gian điểm danh
        await schedule.update({
            attendanceStartTime: startTime,
            attendanceEndTime: endTime
        });

        res.status(200).json({
            message: 'Cập nhật thời gian điểm danh thành công',
            schedule: {
                id: schedule.id,
                classId: schedule.classId,
                dayOfWeek: schedule.dayOfWeek,
                startTime: schedule.startTime,
                endTime: schedule.endTime,
                attendanceStartTime: schedule.attendanceStartTime,
                attendanceEndTime: schedule.attendanceEndTime
            }
        });

    } catch (error) {
        console.error('Lỗi khi cập nhật thời gian điểm danh:', error);
        res.status(500).json({ error: 'Lỗi server khi cập nhật thời gian điểm danh' });
    }
};