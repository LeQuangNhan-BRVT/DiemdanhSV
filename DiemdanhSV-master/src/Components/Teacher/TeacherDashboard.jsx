import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRGenerator from './QRGenerator';
import ClassManagement from './ClassManagement';
import ScheduleManagement from './ScheduleManagement';
import api from '../../services/api';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('classes');
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Kiểm tra xác thực
    if (!user || !['teacher', 'admin'].includes(user.role)) {
      navigate('/auth/teacher/login');
      return;
    }
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Sửa lại endpoint với prefix /api
      const response = await api.get('/classes');
      console.log('API Response:', response.data); // Log để debug
      
      if (response.data) {
        setClasses(response.data);
      } else {
        throw new Error('Không có dữ liệu trả về');
      }
    } catch (err) {
      console.error('Error loading classes:', err);
      if (err.response) {
        console.log('Error status:', err.response.status);
        console.log('Error data:', err.response.data);
      }
      setError('Không thể tải danh sách lớp học. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/teacher/login');
  };

  // Nếu không có user hoặc không phải role teacher/admin thì không render
  if (!user || !['teacher', 'admin'].includes(user.role)) {
    return null;
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-header">
        <h1>Hệ thống Quản lý Điểm danh</h1>
        <div className="user-info">
          <span>Xin chào, {user.username}</span>
          <span>({user.role === 'admin' ? 'Quản trị viên' : 'Giảng viên'})</span>
          <button onClick={handleLogout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Đăng xuất
          </button>
        </div>
      </div>

      <div className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'classes' ? 'active' : ''}`}
          onClick={() => setActiveTab('classes')}
        >
          <i className="fas fa-chalkboard"></i> Quản lý Lớp học
        </button>
        <button 
          className={`nav-btn ${activeTab === 'qr' ? 'active' : ''}`}
          onClick={() => setActiveTab('qr')}
        >
          <i className="fas fa-qrcode"></i> Tạo mã QR
        </button>
        <button 
          className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          <i className="fas fa-calendar-alt"></i> Lịch học
        </button>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={loadClasses} className="retry-btn">
              Thử lại
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'classes' && (
              <ClassManagement 
                classes={classes} 
                onClassesUpdate={loadClasses} 
              />
            )}
            {activeTab === 'qr' && (
              <QRGenerator 
                classes={classes}
              />
            )}
            {activeTab === 'schedule' && (
              <ScheduleManagement 
                classes={classes}
                onScheduleUpdate={loadClasses}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard; 