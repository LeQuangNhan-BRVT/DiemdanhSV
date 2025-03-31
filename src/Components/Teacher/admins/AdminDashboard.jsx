import React, { useState } from "react";
import "./AdminDashboard.css";
import SubjectManagement from "../subjects/SubjectManagement";
import ReportDashboard from "../reports/ReportDashboard";
import QRManagement from "../qr/QRManagement";

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('students');

  const renderContent = () => {
    switch (activeMenu) {
      case 'subjects':
        return <SubjectManagement />;
      case 'reports':
        return <ReportDashboard />;
      case 'qr':
        return <QRManagement />;
      default:
        return (
          <div className="container">
            <div className="header">
              <h1>Quản lý Sinh viên</h1>
              <button className="add-btn">+ Thêm sinh viên</button>
            </div>
            
            <div className="search-bar">
              <input type="text" placeholder="Tìm kiếm sinh viên..." />
              <button className="search-btn">🔍</button>
            </div>
            
            <table className="student-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>MSSV</th>
                  <th>Họ và Tên</th>
                  <th>Ngày sinh</th>
                  <th>Email</th>
                  <th>Lớp</th>
                  <th>Môn học</th>
                  <th>Ngày học</th>
                  <th>Thời gian điểm danh</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>20110001</td>
                  <td>Nguyễn Văn A</td>
                  <td>15/03/2002</td>
                  <td>nguyenvana@example.com</td>
                  <td>CTK43</td>
                  <td>Lập trình Web</td>
                  <td>Thứ 2, Thứ 4</td>
                  <td>07:30 - 11:30</td>
                  <td><span className="status-active">Đã điểm danh</span></td>
                  <td>
                    <button className="edit-btn">Sửa</button>
                    <button className="delete-btn">Xóa</button>
                  </td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>20110002</td>
                  <td>Trần Thị B</td>
                  <td>22/05/2002</td>
                  <td>tranthib@example.com</td>
                  <td>CTK43</td>
                  <td>Cơ sở dữ liệu</td>
                  <td>Thứ 3, Thứ 5</td>
                  <td>13:30 - 17:30</td>
                  <td><span className="status-pending">Chưa điểm danh</span></td>
                  <td>
                    <button className="edit-btn">Sửa</button>
                    <button className="delete-btn">Xóa</button>
                  </td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>20110003</td>
                  <td>Lê Văn C</td>
                  <td>10/08/2002</td>
                  <td>levanc@example.com</td>
                  <td>CTK43</td>
                  <td>An toàn mạng</td>
                  <td>Thứ 6</td>
                  <td>07:30 - 11:30</td>
                  <td><span className="status-absent">Vắng</span></td>
                  <td>
                    <button className="edit-btn">Sửa</button>
                    <button className="delete-btn">Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <ul className="sidebar-menu">
          <li 
            className={activeMenu === 'students' ? 'active' : ''} 
            onClick={() => setActiveMenu('students')}
          >
            👥 Quản lý Sinh viên
          </li>
          <li 
            className={activeMenu === 'subjects' ? 'active' : ''} 
            onClick={() => setActiveMenu('subjects')}
          >
            📖 Quản lý Môn học
          </li>
          <li 
            className={activeMenu === 'qr' ? 'active' : ''} 
            onClick={() => setActiveMenu('qr')}
          >
            📱 Quản lý QR
          </li>
          <li 
            className={activeMenu === 'reports' ? 'active' : ''} 
            onClick={() => setActiveMenu('reports')}
          >
            📈 Báo cáo & Thống kê
          </li>
        </ul>
      </div>

      <div className="main-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
