import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import './Stu.css';

const SignInStudent = () => {
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
      const response = await api.post('/auth/student/login', formData);
      
      // Kiểm tra response và role
      if (!response.data || !response.data.user) {
        throw new Error('Phản hồi không hợp lệ từ server');
      }

      if (response.data.user.role !== 'student') {
        setError('Tài khoản này không phải là sinh viên');
        return;
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/student');
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
        <h2>Đăng nhập Sinh viên</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mã số sinh viên:</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Nhập MSSV"
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
          <Link to="/auth/teacher/login">Đăng nhập dành cho Giảng viên</Link>
        </div>
      </div>
    </div>
  );
};

export default SignInStudent;
