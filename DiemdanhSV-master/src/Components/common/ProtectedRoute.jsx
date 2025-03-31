import React from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || !user.role) {
    // Nếu chưa đăng nhập, chuyển về trang login sinh viên
    return <Navigate to="/auth/student/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Nếu không có quyền truy cập, chuyển về trang dashboard tương ứng với role
    if (user.role === 'student') {
      return <Navigate to="/student" />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/teacher" />;
    }
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ProtectedRoute; 