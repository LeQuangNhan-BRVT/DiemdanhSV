// models/Class.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define('Class', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: { msg: 'Class name is required' },
                notEmpty: { msg: 'Class name cannot be empty' },
            },
        },
        teacherId: { // Khóa ngoại liên kết đến giáo viên (User có role='teacher')
            type: DataTypes.INTEGER,
            allowNull: true, // Cho phép lớp chưa có giáo viên
            references: {
                model: 'Users', // Tên bảng Users
                key: 'id',
            },
            // onDelete: 'SET NULL' // Nếu xóa User(Teacher), teacherId trong Class sẽ thành NULL
            // hoặc để mặc định (phụ thuộc vào cài đặt DB và FK constraint)
        },
    }, {
        tableName: 'Classes',
        timestamps: true
    });

    Class.associate = (models) => {
        // Một Class thuộc về một User (Teacher)
        Class.belongsTo(models.User, {
            foreignKey: 'teacherId',
            as: 'Teacher' // Alias để truy cập (vd: class.getTeacher())
        });

        // Một Class có nhiều bản ghi Attendance
        Class.hasMany(models.Attendance, {
            foreignKey: 'classId',
            as: 'attendances',
            onDelete: 'CASCADE' // Xóa lớp thì xóa luôn điểm danh liên quan
        });

        // Một Class có nhiều Student (quan hệ N-N thông qua bảng ClassStudent)
        Class.belongsToMany(models.Student, {
            through: 'ClassStudent', // Tên bảng trung gian
            foreignKey: 'classId', // Khóa ngoại trong bảng trung gian trỏ về Class
            otherKey: 'studentId', // Khóa ngoại trong bảng trung gian trỏ về Student
            as: 'students' // Alias để truy cập (vd: class.getStudents())
        });
    };

    return Class;
};