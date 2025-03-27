// controllers/attendanceController.js
const QRCode = require('qrcode');
const db = require('../models');
const Attendance = db.Attendance;
const Class = db.Class;
const Student = db.Student;
const ClassSchedule = db.ClassSchedule;
const { Op } = require('sequelize');

// Tạo mã QR cho lớp học (Chỉ Teacher)
exports.generateQR = async (req, res) => {
    try {
        const { classId } = req.body;

        if (!classId) {
            return res.status(400).json({ error: "classId is required" });
        }

        // Kiểm tra xem người dùng có quyền dạy lớp này không (nếu cần logic phức tạp hơn)
        // const isTeacherOfClass = await Class.findOne({ where: { id: classId, teacherId: req.user.id } });
        // if (!isTeacherOfClass) {
        //     return res.status(403).json({ error: "You are not authorized to generate QR for this class" });
        // }

        const classObj = await Class.findByPk(classId);
        if (!classObj) {
            return res.status(404).json({ error: "Class not found" });
        }

        const qrData = JSON.stringify({ classId, timestamp: Date.now() });

        QRCode.toDataURL(qrData, (err, url) => {
            if (err) {
                console.error("QR Code Generation Error:", err);
                return res.status(500).json({ error: "Error generating QR code" });
            }
            res.status(200).json({ qrCodeURL: url });
        });

    } catch (error) {
        console.error("generateQR Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Sinh viên điểm danh (Chỉ Student)
exports.checkIn = async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
        const { qrData } = req.body;
        const studentUserId = req.user.id; // Lấy user ID từ token

        if (!qrData) {
            await transaction.rollback();
            return res.status(400).json({ error: "qrData is required" });
        }

        // 1. Tìm bản ghi Student tương ứng
        const studentObj = await Student.findOne({ where: { userId: studentUserId }, transaction });
        if (!studentObj) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Student record not found for this user account.' });
        }
        const studentDbId = studentObj.id;

        // 2. Giải mã và kiểm tra định dạng QR Data
        let decodedData;
        try {
           decodedData = JSON.parse(qrData);
           if (!decodedData || typeof decodedData.classId !== 'number' || typeof decodedData.timestamp !== 'number') {
                throw new Error('Invalid QR data structure');
           }
        } catch (parseError) {
            await transaction.rollback();
            console.error("QR Data Parse Error:", parseError.message);
            return res.status(400).json({ error: 'Invalid or corrupted QR code data' });
        }
        const { classId, timestamp } = decodedData;

        // 3. Kiểm tra timestamp hợp lệ (không phải tương lai)
        if (timestamp > Date.now()) {
            await transaction.rollback();
            return res.status(400).json({ error: 'Invalid timestamp in QR code (future date)' });
        }

        // 4. Kiểm tra thời hạn QR code
        const QR_EXPIRY_MINUTES = 15; // Đặt thời gian hết hạn QR (ví dụ 15 phút)
        const QR_EXPIRY_MS = QR_EXPIRY_MINUTES * 60 * 1000;
        if ((Date.now() - timestamp) > QR_EXPIRY_MS) {
            await transaction.rollback();
            return res.status(400).json({ error: `QR code expired (valid for ${QR_EXPIRY_MINUTES} minutes)` });
        }

        // 5. Kiểm tra lớp học tồn tại
        const classObj = await Class.findByPk(classId, { transaction });
        if (!classObj) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Class specified in QR code not found' });
        }

        // 6. KIỂM TRA SINH VIÊN CÓ THUỘC LỚP NÀY KHÔNG (Quan trọng cho yêu cầu của bạn)
        const isStudentInClass = await classObj.hasStudent(studentObj, { transaction });
        if (!isStudentInClass) {
            await transaction.rollback();
            // Thông báo rõ lỗi: Sinh viên không thuộc lớp này
            return res.status(403).json({ error: 'You are not enrolled in this class. Cannot check-in.' });
        }

        // 7. KIỂM TRA CÓ ĐANG TRONG BUỔI HỌC CỦA LỚP NÀY KHÔNG
        const now = new Date();
        // Chuyển đổi sang timezone Hồ Chí Minh
        const vietnamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
        const currentDayOfWeek = vietnamTime.getDay(); // 0=Sun, 1=Mon, ...

        // Lấy giờ dạng HH:MM:SS theo múi giờ Việt Nam
        const currentTime = vietnamTime.toLocaleTimeString('en-US', { 
            hour12: false,
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }); 

        // Tìm lịch học phù hợp với thời gian hiện tại
        const currentSchedule = await ClassSchedule.findOne({
            where: {
                classId: classId, // Chỉ tìm trong lịch của lớp này
                dayOfWeek: currentDayOfWeek, // Đúng ngày trong tuần
                startTime: {
                    [Op.lte]: currentTime // Giờ bắt đầu <= giờ hiện tại
                },
                endTime: {
                    [Op.gt]: currentTime  // Giờ kết thúc > giờ hiện tại
                }
                // isActive: true // Nếu có trạng thái active
            },
            transaction
        });

        // Nếu không tìm thấy lịch học nào đang diễn ra
        if (!currentSchedule) {
            await transaction.rollback();
            // Thông báo rõ lỗi: Không phải giờ học
            return res.status(400).json({ error: 'Check-in is not available. Not currently within a scheduled session for this class.' });
        }

        // 8. Kiểm tra điểm danh trong ngày
        const todayStart = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
        todayEnd.setHours(23, 59, 59, 999);

        const existingAttendance = await Attendance.findOne({
            where: {
                // classId: classId, // Không cần nữa nếu đã có scheduleId
                studentId: studentDbId,
                scheduleId: currentSchedule.id, // KIỂM TRA THEO BUỔI HỌC CỤ THỂ
                date: { // Vẫn kiểm tra trong ngày hôm nay để chắc chắn
                    [Op.between]: [todayStart, todayEnd],
                },
            },
            transaction
        });

        if (existingAttendance) {
            await transaction.rollback();
            // Thông báo rõ lỗi: Đã điểm danh buổi này rồi
            return res.status(400).json({ error: 'Already checked in for this specific class session today.' });
        }

        // 9. Tạo bản ghi điểm danh mới, liên kết với buổi học
        const newAttendance = await Attendance.create({
            classId: classId, // Vẫn lưu classId để tiện truy vấn
            studentId: studentDbId,
            scheduleId: currentSchedule.id, // Lưu ID của buổi học đã điểm danh
        }, { transaction });

        await transaction.commit();
        res.status(200).json({ message: `Check-in successful for schedule ${currentSchedule.id}!`, attendance: newAttendance });

    } catch (error) {
        await transaction.rollback();
        console.error("Check-in error:", error);
        res.status(500).json({ error: 'Internal Server Error during check-in process' });
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