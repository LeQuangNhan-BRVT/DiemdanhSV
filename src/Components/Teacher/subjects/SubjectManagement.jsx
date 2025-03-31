import React from 'react';
import './SubjectManagement.css';

const SubjectManagement = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>Quản lý Môn học</h1>
        <button className="add-btn">+ Thêm môn học</button>
      </div>
      
      <div className="search-bar">
        <input type="text" placeholder="Tìm kiếm môn học..." />
        <button className="search-btn">🔍</button>
      </div>
      
      <table className="subject-table">
        <thead>
          <tr>
            <th>Mã môn</th>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Học kỳ</th>
            <th>Giảng viên</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>COMP101</td>
            <td>Lập trình cơ bản</td>
            <td>3</td>
            <td>1</td>
            <td>Trần Thị C</td>
            <td>
              <button className="edit-btn">Sửa</button>
              <button className="delete-btn">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SubjectManagement; 