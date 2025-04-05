import React, { useState } from "react";
import "./Teach.css"; // Đảm bảo đường dẫn chính xác
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';  // Thêm import api

const SignInTeacher = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/teacher/login', formData);
      // Kiểm tra response và role
      if (!response.data || !response.data.user) {
        throw new Error('Phản hồi không hợp lệ từ server');
      }

      if (!['teacher', 'admin'].includes(response.data.user.role)) {
        setError('Tài khoản này không phải là giáo viên');
        return;
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/teacher');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng nhập Giảng viên</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <div className="login-links">
          <Link to="/auth/student/login">Đăng nhập dành cho Sinh viên</Link>
          <Link to="/auth/forgot-password">Quên mật khẩu?</Link>
        </div>
      </div>
    </div>
  );
};

export default SignInTeacher;
