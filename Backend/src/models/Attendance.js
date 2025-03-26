// models/Attendance.js
'use strict';
module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define('Attendance', {
        // Không cần định nghĩa id, classId, studentId ở đây
        // Chúng sẽ được tự động thêm thông qua associations và primary key
        date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Mặc định là thời điểm tạo bản ghi
            allowNull: false,
        },
        // createdAt và updatedAt được tự động quản lý
    }, {
        tableName: 'Attendances',
        timestamps: true
    });

    Attendance.associate = (models) => {
        // Một bản ghi Attendance thuộc về một Class
        Attendance.belongsTo(models.Class, {
            foreignKey: { // Định nghĩa rõ ràng FK
                name: 'classId',
                allowNull: false
            },
            as: 'classInfo' // Alias
        });

        // Một bản ghi Attendance thuộc về một Student
        Attendance.belongsTo(models.Student, {
             foreignKey: { // Định nghĩa rõ ràng FK
                name: 'studentId',
                allowNull: false
            },
            as: 'studentInfo' // Alias
        });
    };

    return Attendance;
};