import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRScanner from './QRScanner/QRScanner';
import attendanceService from '../../services/attendanceService';
import './StudentDashboard.css';
import { useAuth } from '../../hooks/useAuth';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scanner');
  const [attendanceHistory, setAttendanceHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useAuth(['student']);

  useEffect(() => {
    if (activeTab === 'history') {
      loadAttendanceHistory();
    }
  }, [activeTab]);

  const loadAttendanceHistory = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getStudentHistory();
      setAttendanceHistory(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/student/login');
  };

  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <h1>Hệ thống Điểm danh</h1>
        <div className="user-info">
          <span>Xin chào, {user.name}</span>
          <span>MSSV: {user.studentId}</span>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'scanner' ? 'active' : ''}`}
          onClick={() => setActiveTab('scanner')}
        >
          <i className="fas fa-qrcode"></i> Quét mã QR
        </button>
        <button 
          className={`nav-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="fas fa-history"></i> Lịch sử điểm danh
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'scanner' ? (
          <QRScanner onSuccess={loadAttendanceHistory} />
        ) : (
          <div className="attendance-history">
            <h2>Lịch sử điểm danh</h2>
            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : attendanceHistory ? (
              <div className="history-content">
                <div className="history-summary">
                  <p>Tổng số lần điểm danh: {attendanceHistory.totalAttendance}</p>
                </div>
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Lớp</th>
                      <th>Thời gian điểm danh</th>
                      <th>Buổi học</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceHistory.history.map((record, index) => (
                      <tr key={index}>
                        <td>{new Date(record.date).toLocaleDateString('vi-VN')}</td>
                        <td>{record.className}</td>
                        <td>{new Date(record.checkinTime).toLocaleTimeString('vi-VN')}</td>
                        <td>
                          {record.schedule ? (
                            `${['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][record.schedule.dayOfWeek]} ${record.schedule.time}`
                          ) : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-data">Không có dữ liệu điểm danh</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard; 