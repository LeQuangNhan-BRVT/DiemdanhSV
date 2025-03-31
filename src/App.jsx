import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import StudentDashboard from "./Components/students/StudentDashboard";
import AdminDashboard from "./Components/teacher/admins/AdminDashboard";
import authService from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
    role: "student", // student hoặc teacher
  });

  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const handleRoleChange = (role) => {
    setLoginForm({
      ...loginForm,
      role,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    try {
      let userData;
      if (loginForm.role === "student") {
        userData = await authService.loginStudent(
          loginForm.username,
          loginForm.password
        );
      } else {
        userData = await authService.loginTeacher(
          loginForm.username,
          loginForm.password
        );
      }
      setUser(userData);
    } catch (error) {
      setLoginError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return <div className="loading-screen">Đang tải...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === "student" ? (
                  <Navigate to="/student" />
                ) : (
                  <Navigate to="/admin" />
                )
              ) : (
                <div className="login-container">
                  <div className="login-form-container">
                    <div className="login-header">
                      <img src="/logo.png" alt="Logo" className="login-logo" />
                      <h1>Hệ thống điểm danh sinh viên</h1>
                    </div>

                    <div className="login-tabs">
                      <button
                        className={`login-tab ${
                          loginForm.role === "student" ? "active" : ""
                        }`}
                        onClick={() => handleRoleChange("student")}
                      >
                        <i className="fas fa-user-graduate"></i> Sinh viên
                      </button>
                      <button
                        className={`login-tab ${
                          loginForm.role === "teacher" ? "active" : ""
                        }`}
                        onClick={() => handleRoleChange("teacher")}
                      >
                        <i className="fas fa-chalkboard-teacher"></i> Giảng viên
                      </button>
                    </div>

                    {loginError && (
                      <div className="login-error">{loginError}</div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">
                      <div className="form-group">
                        <label htmlFor="username">
                          {loginForm.role === "student"
                            ? "Mã số sinh viên"
                            : "Email/Tên đăng nhập"}
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={loginForm.username}
                          onChange={handleLoginChange}
                          required
                          placeholder={
                            loginForm.role === "student"
                              ? "Nhập MSSV"
                              : "Nhập email hoặc tên đăng nhập"
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          required
                          placeholder="Nhập mật khẩu"
                        />
                      </div>

                      <button type="submit" className="login-button">
                        <i className="fas fa-sign-in-alt"></i> Đăng nhập
                      </button>
                    </form>
                  </div>

                  <div className="login-info">
                    <div className="info-section">
                      <h3>
                        <i className="fas fa-info-circle"></i> Thông tin
                      </h3>
                      <p>
                        Hệ thống điểm danh sinh viên sử dụng mã QR để quản lý
                        việc điểm danh trong các lớp học.
                      </p>
                      <ul>
                        <li>Giảng viên tạo mã QR để sinh viên điểm danh</li>
                        <li>
                          Sinh viên quét mã QR để xác nhận tham gia lớp học
                        </li>
                        <li>Theo dõi lịch sử điểm danh và thời khóa biểu</li>
                      </ul>
                    </div>
                    <div className="info-footer">
                      <p>&copy; 2024 Hệ thống Điểm danh Sinh viên - STU</p>
                    </div>
                  </div>
                </div>
              )
            }
          />
          <Route
            path="/student"
            element={
              user && user.role === "student" ? (
                <StudentDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user && (user.role === "teacher" || user.role === "admin") ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
