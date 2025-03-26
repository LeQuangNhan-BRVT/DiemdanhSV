// controllers/attendanceController.js
const QRCode = require('qrcode');
const db = require('../models');
const Attendance = db.Attendance;
const Class = db.Class;
const Student = db.Student;
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
    try {
        const { qrData } = req.body;
        const studentUserId = req.user.id; // Lấy user ID từ token JWT

        if (!qrData) {
            return res.status(400).json({ error: "qrData is required" });
        }

        // Tìm sinh viên dựa trên userId từ token
        const studentObj = await Student.findOne({ where: { userId: studentUserId } });
        if (!studentObj) {
            // Lỗi này không nên xảy ra nếu token hợp lệ và có student tương ứng
             return res.status(404).json({ error: 'Student record not found for this user.' });
        }
        const studentDbId = studentObj.id; // ID của bản ghi Student trong database

        let decodedData;
        try {
           decodedData = JSON.parse(qrData);
        } catch (parseError) {
             return res.status(400).json({ error: 'Invalid QR code data format' });
        }

        const { classId, timestamp } = decodedData;

        // Kiểm tra xem timestamp có hợp lệ không
        if (typeof timestamp !== 'number' || timestamp > Date.now()) {
             return res.status(400).json({ error: 'Invalid timestamp in QR code' });
        }

        // Kiểm tra thời gian hết hạn của QR code (ví dụ: 15 phút)
        const timeDifference = Date.now() - timestamp;
        const QR_EXPIRY_MS = 15 * 60 * 1000; // 15 phút
        if (timeDifference > QR_EXPIRY_MS) {
            return res.status(400).json({ error: "QR code expired" });
        }

        // Kiểm tra lớp học có tồn tại không
        const classObj = await Class.findByPk(classId);
        if (!classObj) {
            return res.status(404).json({ error: 'Class specified in QR code not found' });
        }

        // Kiểm tra xem sinh viên có thuộc lớp học này không
        const isStudentInClass = await classObj.hasStudent(studentObj);
        if (!isStudentInClass) {
            return res.status(403).json({ error: 'You are not enrolled in this class' });
        }

        // Kiểm tra xem sinh viên đã điểm danh cho lớp này vào ngày hôm nay chưa
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const existingAttendance = await Attendance.findOne({
            where: {
                classId: classId,
                studentId: studentDbId, // Dùng ID của bảng Student
                date: { // Tìm trong khoảng thời gian của ngày hôm nay
                    [Op.between]: [todayStart, todayEnd],
                },
            },
        });

        if (existingAttendance) {
            return res.status(400).json({ error: 'Already checked in for this class today' });
        }

        // Tạo bản ghi điểm danh mới
        const newAttendance = await Attendance.create({
            classId: classId,
            studentId: studentDbId,
            // date được tự động thêm bởi defaultValue
        });

        res.status(200).json({ message: 'Check-in successful', attendance: newAttendance });

    } catch (error) {
        console.error("Check-in error:", error);
        // Bắt các lỗi cụ thể khác nếu cần
        res.status(500).json({ error: 'Internal Server Error during check-in' });
    }
};

// Có thể thêm các hàm xem lịch sử điểm danh (cho student, teacher, admin)