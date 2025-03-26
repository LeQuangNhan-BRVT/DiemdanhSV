// controllers/classController.js
const db = require('../models');
const Class = db.Class;
const Student = db.Student;
const User = db.User; // Import User để kiểm tra teacherId
const { Op } = require('sequelize');

// Tạo lớp học mới (Admin hoặc Teacher)
exports.createClass = async (req, res) => {
    try {
        const { name } = req.body;
        // teacherId có thể được lấy từ req.user nếu là teacher tạo, hoặc từ body nếu admin tạo
        const teacherId = req.user.role === 'teacher' ? req.user.id : req.body.teacherId;

        if (!name) {
            return res.status(400).json({ error: "Class name is required" });
        }

        // (Tùy chọn) Kiểm tra teacherId có tồn tại và là teacher không
        if (teacherId) {
            const teacher = await User.findOne({ where: { id: teacherId, role: 'teacher' } });
            if (!teacher) {
                 return res.status(400).json({ error: "Invalid teacher ID or user is not a teacher" });
            }
        }

        const newClass = await Class.create({ name, teacherId: teacherId || null });
        res.status(201).json(newClass);
    } catch (err) {
        if (err.name === 'SequelizeValidationError') {
            const messages = err.errors.map(e => e.message);
            return res.status(400).json({ error: messages.join(', ') });
        }
        console.error("Create class error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Lấy tất cả lớp học (Admin hoặc Teacher)
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await Class.findAll({
            include: [{
                model: Student,
                attributes: ['id', 'name', 'studentId'], // Chỉ lấy các trường cần thiết của Student
                through: { attributes: [] } // Không lấy các cột của bảng trung gian
            }],
            order: [['createdAt', 'DESC']] // Sắp xếp theo thời gian tạo mới nhất
        });
        res.json(classes);
    } catch (err) {
        console.error("Get all classes error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Lấy thông tin chi tiết một lớp học (Admin hoặc Teacher)
exports.getClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const classObj = await Class.findByPk(id, {
             include: [{
                model: Student,
                attributes: ['id', 'name', 'studentId'],
                through: { attributes: [] }
            }]
        });

        if (!classObj) {
            return res.status(404).json({ error: 'Class not found' });
        }
        res.json(classObj);
    } catch (err) {
        console.error("Get class by ID error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Thêm sinh viên vào lớp học (Admin hoặc Teacher)
exports.addStudentToClass = async (req, res) => {
    try {
        const { classId, studentId } = req.params; // Lấy từ params hoặc body tùy thiết kế route

        const classObj = await Class.findByPk(classId);
        if (!classObj) {
            return res.status(404).json({ error: 'Class not found' });
        }

        const studentObj = await Student.findByPk(studentId); // Tìm student bằng ID của bảng Student
        if (!studentObj) {
             return res.status(404).json({ error: 'Student not found' });
        }

        // Kiểm tra xem sinh viên đã có trong lớp chưa
        const isAlreadyInClass = await classObj.hasStudent(studentObj);
        if(isAlreadyInClass){
             return res.status(400).json({ error: 'Student already in this class' });
        }

        await classObj.addStudent(studentObj); // Thêm sinh viên vào lớp

        res.status(200).json({ message: 'Student added to class successfully' });
    } catch (err) {
        console.error("Add student to class error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Xóa sinh viên khỏi lớp học (Admin hoặc Teacher)
exports.removeStudentFromClass = async (req, res) => {
     try {
        const { classId, studentId } = req.params;

        const classObj = await Class.findByPk(classId);
        if (!classObj) {
            return res.status(404).json({ error: 'Class not found' });
        }

        const studentObj = await Student.findByPk(studentId);
        if (!studentObj) {
             return res.status(404).json({ error: 'Student not found' });
        }

        const isStudentInClass = await classObj.hasStudent(studentObj);
        if(!isStudentInClass){
             return res.status(404).json({ error: 'Student not found in this class' });
        }

        await classObj.removeStudent(studentObj); // Xóa sinh viên khỏi lớp

        res.status(200).json({ message: 'Student removed from class successfully' });
    } catch (err) {
        console.error("Remove student from class error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Có thể thêm các hàm updateClass, deleteClass,...