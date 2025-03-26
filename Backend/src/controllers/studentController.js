// controllers/studentController.js
const db = require('../models');
const Student = db.Student;

// Hàm này không nên được sử dụng trực tiếp, việc tạo Student được xử lý bởi Admin
exports.createStudent = async (req, res) => {
    res.status(501).json({ error: 'Not Implemented. Students should be created by an administrator.' });
};

// Lấy danh sách tất cả sinh viên (Admin hoặc Teacher)
exports.getAllStudents = async (req, res) => {
    try {
        // Lấy thông tin cơ bản, có thể thêm phân trang nếu cần
        const students = await Student.findAll({
            attributes: ['id', 'name', 'studentId', 'email', 'createdAt'], // Chọn các trường cần thiết
            order: [['name', 'ASC']] // Sắp xếp theo tên
        });
        res.json(students);
    } catch (err) {
        console.error("Get all students error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Lấy thông tin chi tiết một sinh viên (Admin hoặc Teacher)
exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findByPk(id, {
            include: [db.User] // (Tùy chọn) Có thể include User để xem thông tin liên quan
        });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (err) {
        console.error("Get student by ID error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Có thể thêm các hàm updateStudent, deleteStudent (chỉ cho Admin)