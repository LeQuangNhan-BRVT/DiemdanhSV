const { where } = require("sequelize");
const db = require("../models");
const User = db.User;
const Student = db.Student;
const bcrypt = require("bcrypt");
const ClassSchedule = require("../models/ClassSchedule");
const jwt = require("jsonwebtoken");

//admin tao cac users khac bao gom: student, teacher, other admin
exports.createUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { username, password, role, email, studentId, name } = req.body;

    //xac thuc
    if (!username || !password || !role) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "Tai khoan, mat khau khong hop le!" });
    }
    if (!["student", "teacher", "admin"].includes(role)) {
      await transaction.rollback();
      return res.status(400).json({ error: "Role khong hop le!" });
    }

    let finalUsername = username;
    if (role === "student") {
      if (!studentId) {
        await transaction.rollback();
        return res.status(400).json({ error: "Tai khoan khong duoc trong" });
      }
      if (!name) {
        await transaction.rollback();
        return res.status(400).json({ error: "Mat khau khong hop le!" });
      }
      finalUsername = studentId;
    }
    //hash mat khau
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //tao user
    const newUser = await User.create(
      {
        username: finalUsername,
        password: hashedPassword,
        role,
        email,
        studentId: role === "student" ? studentId : null,
      },
      { transaction }
    );
    if (role === "student") {
      await Student.create(
        {
          userId: newUser.id,
          studentId,
          name,
          email: email || null,
        },
        { transaction }
      );
    }
    await transaction.commit();

    res.status(201).json({
      message: "Tao nguoi dung thanh cong",
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    await transaction.rollback(); //quay ve neu co loi
    if (error.name === "SequelizeUniqueConstraintError") {
      // Xác định cụ thể trường nào bị trùng lặp
      const field = error.errors[0]?.path || "field";
      return res.status(400).json({ error: `${field} already exists` });
    }
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    console.error("Create user error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Hay nhap tai khoan va mat khau' });
    }

    const admin = await User.findOne({
      where: {
        username,
        role: 'admin'
      }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Tai khoan admin khong ton tai' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mat khau sai' });
    }

    // JWT
    const payload = {
      id: admin.id,
      role: admin.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Tra thong tin admin
    const responseUser = {
      id: admin.id,
      username: admin.username,
      role: admin.role,
      email: admin.email
    };

    res.status(200).json({
      message: 'Dang nhap thanh cong',
      user: responseUser,
      token
    });

  } catch (error) {
    console.log("Dang nhap admin that bai:", error);
    res.status(500).json({ error: 'Server loi!' });
  }
};


