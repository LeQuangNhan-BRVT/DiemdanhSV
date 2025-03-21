const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const CryptoJS = require('crypto-js');
const pool = require('../connections/db');
require('dotenv').config();

// Tạo QR code cho một buổi học
exports.generateSessionQR = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const expiryMinutes = req.body.expiryMinutes || 15; // Mặc định QR code hết hạn sau 15 phút
    
    // Kiểm tra buổi học tồn tại
    const [sessions] = await pool.execute('SELECT * FROM sessions WHERE id = ?', [sessionId]);
    
    if (sessions.length === 0) {
      return res.status(404).json({ message: 'Buổi học không tồn tại' });
    }
    
    const session = sessions[0];
    
    // Kiểm tra quyền
    if (req.user.role === 'teacher') {
      const [classes] = await pool.execute('SELECT * FROM classes WHERE id = ?', [session.class_id]);
      if (classes[0].teacher_id !== req.user.id) {
        return res.status(403).json({ message: 'Bạn không có quyền tạo QR code cho buổi học này' });
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền tạo QR code' });
    }
    
    // Tạo token và thời gian hết hạn
    const token = uuidv4();
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + expiryMinutes);
    
    // Cập nhật session với token và thời gian hết hạn
    await pool.execute(
      'UPDATE sessions SET session_token = ?, qr_code_expiry = ? WHERE id = ?',
      [token, expiryTime, sessionId]
    );
    
    // Tạo QR code
    const qrData = {
      type: 'session',
      sessionId: sessionId,
      token: token,
      expiry: expiryTime.toISOString()
    };
    
    // Mã hóa dữ liệu QR
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(qrData),
      process.env.JWT_SECRET
    ).toString();
    
    // Tạo URL cho QR code
    const qrUrl = `${req.protocol}://${req.get('host')}/api/attendance/qr/verify/${encodeURIComponent(encryptedData)}`;
    
    // Tạo QR code dạng base64
    const qrCodeBase64 = await QRCode.toDataURL(qrUrl);
    
    res.json({
      qrCode: qrCodeBase64,
      expiry: expiryTime,
      sessionId: sessionId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tạo QR code cá nhân cho sinh viên
exports.generateStudentQR = async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user.id : req.body.studentId;
    const expiryDays = req.body.expiryDays || 30; // Mặc định QR code hết hạn sau 30 ngày
    
    // Kiểm tra sinh viên tồn tại
    const [students] = await pool.execute('SELECT * FROM users WHERE id = ? AND role = "student"', [studentId]);
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'Sinh viên không tồn tại' });
    }
    
    // Kiểm tra quyền
    if (req.user.role !== 'admin' && req.user.role !== 'teacher' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Bạn không có quyền tạo QR code cho sinh viên này' });
    }
    
    // Tạo token và thời gian hết hạn
    const token = uuidv4();
    const expiryTime = new Date();
    expiryTime.setDate(expiryTime.getDate() + expiryDays);
    
    // Cập nhật hoặc tạo mới QR code cho sinh viên
    const [existingQR] = await pool.execute(
      'SELECT * FROM student_qr_codes WHERE student_id = ? AND is_active = TRUE',
      [studentId]
    );
    
    if (existingQR.length > 0) {
      // Vô hiệu hóa QR code cũ
      await pool.execute(
        'UPDATE student_qr_codes SET is_active = FALSE WHERE student_id = ? AND is_active = TRUE',
        [studentId]
      );
    }
    
    // Tạo QR code mới
    await pool.execute(
      'INSERT INTO student_qr_codes (student_id, qr_token, expires_at) VALUES (?, ?, ?)',
      [studentId, token, expiryTime]
    );
    
    // Tạo QR code
    const qrData = {
      type: 'student',
      studentId: studentId,
      token: token,
      expiry: expiryTime.toISOString()
    };
    
    // Mã hóa dữ liệu QR
    const encryptedData = CryptoJS.AES.encrypt(
      JSON.stringify(qrData),
      process.env.JWT_SECRET
    ).toString();
    
    // Tạo URL cho QR code
    const qrUrl = `${req.protocol}://${req.get('host')}/api/attendance/qr/verify/${encodeURIComponent(encryptedData)}`;
    
    // Tạo QR code dạng base64
    const qrCodeBase64 = await QRCode.toDataURL(qrUrl);
    
    res.json({
      qrCode: qrCodeBase64,
      expiry: expiryTime,
      studentId: studentId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xác minh QR code khi sinh viên quét
exports.verifyQR = async (req, res) => {
  try {
    const { encryptedData } = req.params;
    const { sessionId } = req.body; // Chỉ cần cho QR code sinh viên
    
    // Giải mã dữ liệu QR
    const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), process.env.JWT_SECRET);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    
    // Kiểm tra thời gian hết hạn
    const expiryTime = new Date(decryptedData.expiry);
    if (expiryTime < new Date()) {
      return res.status(400).json({ message: 'QR code đã hết hạn' });
    }
    
    // Xử lý dựa trên loại QR code
    if (decryptedData.type === 'session') {
      // QR code cho buổi học
      const [sessions] = await pool.execute(
        'SELECT * FROM sessions WHERE id = ? AND session_token = ?',
        [decryptedData.sessionId, decryptedData.token]
      );
      
      if (sessions.length === 0) {
        return res.status(404).json({ message: 'Buổi học không tồn tại hoặc QR code không hợp lệ' });
      }
      
      // Kiểm tra sinh viên có trong lớp không
      const [enrollments] = await pool.execute(
        'SELECT * FROM class_enrollments WHERE class_id = ? AND student_id = ?',
        [sessions[0].class_id, req.user.id]
      );
      
      if (enrollments.length === 0) {
        return res.status(403).json({ message: 'Bạn không đăng ký lớp học này' });
      }
      
      // Cập nhật trạng thái điểm danh
      const [attendance] = await pool.execute(
        'SELECT * FROM attendance WHERE session_id = ? AND student_id = ?',
        [decryptedData.sessionId, req.user.id]
      );
      
      if (attendance.length === 0) {
        // Nếu chưa có bản ghi điểm danh, tạo mới
        const [result] = await pool.execute(
          'INSERT INTO attendance (session_id, student_id, status, check_in_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
          [decryptedData.sessionId, req.user.id, 'present']
        );
        
        // Ghi log điểm danh
        await pool.execute(
          'INSERT INTO qr_attendance_logs (attendance_id, method, ip_address, device_info) VALUES (?, ?, ?, ?)',
          [result.insertId, 'session_qr', req.ip, req.headers['user-agent']]
        );
      } else {
        // Nếu đã có, cập nhật trạng thái
        await pool.execute(
          'UPDATE attendance SET status = ?, check_in_time = CURRENT_TIMESTAMP WHERE id = ?',
          ['present', attendance[0].id]
        );
        
        // Ghi log điểm danh
        await pool.execute(
          'INSERT INTO qr_attendance_logs (attendance_id, method, ip_address, device_info) VALUES (?, ?, ?, ?)',
          [attendance[0].id, 'session_qr', req.ip, req.headers['user-agent']]
        );
      }
      
      res.json({ message: 'Điểm danh thành công' });
    } else if (decryptedData.type === 'student') {
      // QR code của sinh viên
      if (!sessionId) {
        return res.status(400).json({ message: 'Thiếu sessionId' });
      }
      
      // Kiểm tra QR code sinh viên có hợp lệ không
      const [qrCodes] = await pool.execute(
        'SELECT * FROM student_qr_codes WHERE student_id = ? AND qr_token = ? AND is_active = TRUE',
        [decryptedData.studentId, decryptedData.token]
      );
      
      if (qrCodes.length === 0) {
        return res.status(404).json({ message: 'QR code sinh viên không hợp lệ' });
      }
      
      // Kiểm tra buổi học tồn tại
      const [sessions] = await pool.execute('SELECT * FROM sessions WHERE id = ?', [sessionId]);
      
      if (sessions.length === 0) {
        return res.status(404).json({ message: 'Buổi học không tồn tại' });
      }
      
      // Kiểm tra sinh viên có trong lớp không
      const [enrollments] = await pool.execute(
        'SELECT * FROM class_enrollments WHERE class_id = ? AND student_id = ?',
        [sessions[0].class_id, decryptedData.studentId]
      );
      
      if (enrollments.length === 0) {
        return res.status(403).json({ message: 'Sinh viên không đăng ký lớp học này' });
      }
      
      // Cập nhật trạng thái điểm danh
      const [attendance] = await pool.execute(
        'SELECT * FROM attendance WHERE session_id = ? AND student_id = ?',
        [sessionId, decryptedData.studentId]
      );
      
      if (attendance.length === 0) {
        // Nếu chưa có bản ghi điểm danh, tạo mới
        const [result] = await pool.execute(
          'INSERT INTO attendance (session_id, student_id, status, check_in_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
          [sessionId, decryptedData.studentId, 'present']
        );
        
        // Ghi log điểm danh
        await pool.execute(
          'INSERT INTO qr_attendance_logs (attendance_id, method, ip_address, device_info) VALUES (?, ?, ?, ?)',
          [result.insertId, 'student_qr', req.ip, req.headers['user-agent']]
        );
      } else {
        // Nếu đã có, cập nhật trạng thái
        await pool.execute(
          'UPDATE attendance SET status = ?, check_in_time = CURRENT_TIMESTAMP WHERE id = ?',
          ['present', attendance[0].id]
        );
        
        // Ghi log điểm danh
        await pool.execute(
          'INSERT INTO qr_attendance_logs (attendance_id, method, ip_address, device_info) VALUES (?, ?, ?, ?)',
          [attendance[0].id, 'student_qr', req.ip, req.headers['user-agent']]
        );
      }
      
      res.json({ message: 'Điểm danh thành công' });
    } else {
      return res.status(400).json({ message: 'Loại QR code không hợp lệ' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
