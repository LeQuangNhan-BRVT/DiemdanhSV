// controllers/classController.js
const db = require("../models");
const Class = db.Class;
const Student = db.Student;
const User = db.User; // Import User để kiểm tra teacherId
const ClassSchedule = db.ClassSchedule;
const { Op, json } = require("sequelize");

// Tạo lớp học mới (Admin hoặc Teacher)
exports.createClass = async (req, res) => {
  try {
    const { name } = req.body;
    // teacherId có thể được lấy từ req.user nếu là teacher tạo, hoặc từ body nếu admin tạo
    const teacherId =
      req.user.role === "teacher" ? req.user.id : req.body.teacherId;

    if (!name) {
      return res.status(400).json({ error: "Class name is required" });
    }

    // (Tùy chọn) Kiểm tra teacherId có tồn tại và là teacher không
    if (teacherId) {
      const teacher = await User.findOne({
        where: { id: teacherId, role: "teacher" },
      });
      if (!teacher) {
        return res
          .status(400)
          .json({ error: "Invalid teacher ID or user is not a teacher" });
      }
    }

    const newClass = await Class.create({ name, teacherId: teacherId || null });
    res.status(201).json(newClass);
  } catch (err) {
    if (err.name === "SequelizeValidationError") {
      const messages = err.errors.map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    console.error("Create class error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Lấy tất cả lớp học (Admin hoặc Teacher)
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll({
      include: [
        {
          model: Student,
          attributes: ["id", "name", "studentId"], // Chỉ lấy các trường cần thiết của Student
          through: { attributes: [] }, // Không lấy các cột của bảng trung gian
        },
      ],
      order: [["createdAt", "DESC"]], // Sắp xếp theo thời gian tạo mới nhất
    });
    res.json(classes);
  } catch (err) {
    console.error("Get all classes error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Lấy thông tin chi tiết một lớp học (Admin hoặc Teacher)
exports.getClassById = async (req, res) => {
  try {
    const { id } = req.params;
    const classObj = await Class.findByPk(id, {
      include: [
        {
          model: Student,
          attributes: ["id", "name", "studentId"],
          through: { attributes: [] },
        },
      ],
    });

    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(classObj);
  } catch (err) {
    console.error("Get class by ID error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Thêm sinh viên vào lớp học (Admin hoặc Teacher)
exports.addStudentToClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params; // Lấy từ params hoặc body tùy thiết kế route

    const classObj = await Class.findByPk(classId);
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }

    const studentObj = await Student.findByPk(studentId); // Tìm student bằng ID của bảng Student
    if (!studentObj) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Kiểm tra xem sinh viên đã có trong lớp chưa
    const isAlreadyInClass = await classObj.hasStudent(studentObj);
    if (isAlreadyInClass) {
      return res.status(400).json({ error: "Student already in this class" });
    }

    await classObj.addStudent(studentObj); // Thêm sinh viên vào lớp

    res.status(200).json({ message: "Student added to class successfully" });
  } catch (err) {
    console.error("Add student to class error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Xóa sinh viên khỏi lớp học (Admin hoặc Teacher)
exports.removeStudentFromClass = async (req, res) => {
  try {
    const { classId, studentId } = req.params;

    const classObj = await Class.findByPk(classId);
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }

    const studentObj = await Student.findByPk(studentId);
    if (!studentObj) {
      return res.status(404).json({ error: "Student not found" });
    }

    const isStudentInClass = await classObj.hasStudent(studentObj);
    if (!isStudentInClass) {
      return res.status(404).json({ error: "Student not found in this class" });
    }

    await classObj.removeStudent(studentObj); // Xóa sinh viên khỏi lớp

    res
      .status(200)
      .json({ message: "Student removed from class successfully" });
  } catch (err) {
    console.error("Remove student from class error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//Tạo lịch học cho một lớp
exports.createSchedule = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { classId } = req.params; //lay classId tu URL
    const { dayOfWeek, startTime, endTime } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    //Kiem tra thu
    if (dayOfWeek === undefined || !startTime || !endTime) {
      await transaction.rollback();
      return res
        .status(400)
        .json({
          error:
            "ngay trong tuan, thoi gian bat dau, thoi gian ket thuc phai nhap vao",
        });
    }
    //Kiem tra lop hoc
    const classObj = await Class.findByPk(classId, { transaction });
    if (!classObj) {
      await transaction.rollback();
      res.status(400).json({ error: "Khong tim thay lop hoc" });
    }
    //Kiem tra phai la teacher || admin khong
    if (userRole !== "admin" && classObj.teacherId !== userId) {
      await transaction.rollback();
      res.status(400).json({ error: "Ban khong co quyen tao buoi hoc" });
    }
    //Tao buoi hoc
    const newSchedule = await ClassSchedule.create(
      {
        classId: classObj.id,
        dayOfWeek,
        startTime,
        endTime,
      },
      { transaction }
    );
    await transaction.commit();
    res.status(201).json(newSchedule);
  } catch (error) {
    await transaction.rollback();
    if (error.name === "SequelizeValidationError") {
      const message = error.errors.map((e) => e.message);
      return res.status(400), json({ error: message.join(", ") });
    }
    console.error("tao lich hoc that bai", error);
    res.status(500).json({ error: "Loi server trong khi tao lich hoc" });
  }
};
// Lấy tất cả lịch học của một lớp (Teacher/Admin)
exports.getClassSchedules = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const classObj = await Class.findByPk(classId);
    if (!classObj) {
      return res.status(404).json({ error: "Class not found" });
    }

    // Kiểm tra quyền xem (Admin hoặc đúng Teacher của lớp)
    // Hoặc có thể cho phép Student xem lịch học của lớp họ tham gia (tùy yêu cầu)
    // if (userRole !== 'admin' && classObj.teacherId !== userId) {
    //     // Logic kiểm tra student có trong lớp không nếu muốn cho student xem
    //     return res.status(403).json({ error: 'You do not have permission to view schedules for this class' });
    // }

    const schedules = await ClassSchedule.findAll({
      where: { classId: classId },
      order: [
        ["dayOfWeek", "ASC"],
        ["startTime", "ASC"],
      ], // Sắp xếp theo ngày và giờ bắt đầu
    });
    res.json(schedules);
  } catch (error) {
    console.error("Get class schedules error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Cập nhật một lịch học cụ thể (Teacher/Admin)
exports.updateSchedule = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { classId, scheduleId } = req.params;
    const { dayOfWeek, startTime, endTime } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. Tìm lịch học cần cập nhật
    const schedule = await ClassSchedule.findOne({
      where: { id: scheduleId, classId: classId }, // Đảm bảo schedule thuộc đúng class
      include: [{ model: Class, as: "classInfo", attributes: ["teacherId"] }], // Lấy teacherId của lớp
      transaction,
    });

    if (!schedule) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ error: "Schedule not found for this class" });
    }

    // 2. Kiểm tra quyền cập nhật
    if (userRole !== "admin" && schedule.classInfo.teacherId !== userId) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ error: "You do not have permission to update this schedule" });
    }

    // 3. Cập nhật lịch học (chỉ cập nhật các trường được cung cấp)
    const updatedData = {};
    if (dayOfWeek !== undefined) updatedData.dayOfWeek = dayOfWeek;
    if (startTime !== undefined) updatedData.startTime = startTime;
    if (endTime !== undefined) updatedData.endTime = endTime;

    // Kiểm tra lại endTime > startTime nếu cả hai đều được cập nhật
    const finalStartTime = updatedData.startTime || schedule.startTime;
    const finalEndTime = updatedData.endTime || schedule.endTime;
    if (finalEndTime <= finalStartTime) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "End time must be after start time" });
    }

    const updatedSchedule = await schedule.update(updatedData, { transaction });

    await transaction.commit();
    res.json(updatedSchedule);
  } catch (error) {
    await transaction.rollback();
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    console.error("Update schedule error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error while updating schedule" });
  }
};

// Xóa một lịch học cụ thể (Teacher/Admin)
exports.deleteSchedule = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { classId, scheduleId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // 1. Tìm lịch học cần xóa
    const schedule = await ClassSchedule.findOne({
      where: { id: scheduleId, classId: classId },
      include: [{ model: Class, as: "classInfo", attributes: ["teacherId"] }],
      transaction,
    });

    if (!schedule) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ error: "Schedule not found for this class" });
    }

    // 2. Kiểm tra quyền xóa
    if (userRole !== "admin" && schedule.classInfo.teacherId !== userId) {
      await transaction.rollback();
      return res
        .status(403)
        .json({ error: "You do not have permission to delete this schedule" });
    }

    // 3. Xóa lịch học
    await schedule.destroy({ transaction });

    await transaction.commit();
    res.status(204).send(); // 204 No Content - Xóa thành công
  } catch (error) {
    await transaction.rollback();
    console.error("Delete schedule error:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error while deleting schedule" });
  }
};