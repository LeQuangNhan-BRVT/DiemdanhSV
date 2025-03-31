import React, { useState } from "react";
import "./Stu.css";
import api from "../../services/api";
export default (props) => {
  const [input1, setInput1] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Thêm state loading
  const [error, setError] = useState(""); // Thêm state error
  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      // Gọi API đăng nhập
      const response = await api.post("/auth/login", {
        username: input1,
        password: password,
      });

      // Lưu token và chuyển hướng
      localStorage.setItem("token", response.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      console.error("Login error:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="contain">
      <div
        className="view"
        style={{
          backgroundImage:
            "url(https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/71msd8fb.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="scroll-view">
          <div className="column">
            <div className="column2">
              <h1 className="text">Đăng nhập</h1>

              <div className="input-container">
                <div className="icon-wrapper">
                  <img
                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/nborv8r1.png"
                    className="input-icon"
                    alt="student-icon"
                  />
                </div>
                <input
                  type="text"
                  placeholder="MSSV"
                  className="form-input"
                  value={input1}
                  onChange={(e) => setInput1(e.target.value)}
                />
                <div className="icon-wrapper">
                  <img
                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/g5gjlk7i.png"
                    className="input-icon"
                    alt="info-icon"
                  />
                </div>
              </div>

              <div className="input-container">
                <div className="icon-wrapper">
                  <img
                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/a10xx0b8.png"
                    className="input-icon"
                    alt="password-icon"
                  />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="icon-wrapper">
                  <img
                    src="https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/6pn6rblc.png"
                    className="input-icon"
                    alt="visibility-icon"
                  />
                </div>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button
                className="login-button"
                onClick={handleLogin}
                disabled={loading} // Thêm trạng thái disabled
              >
                {loading ? (
                  <span className="button-text">Đang xử lý...</span>
                ) : (
                  <span className="button-text">Đăng nhập</span>
                )}
              </button>

              <button
                className="forgot-password"
                onClick={() => alert("Forgot password pressed!")}
              >
                Bạn quên mật khẩu à?
              </button>
            </div>

            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/brebfeg2.png"
              className="decorative-image left"
              alt="left-decoration"
            />
            <img
              src="https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/lch9kyu0.png"
              className="decorative-image right"
              alt="right-decoration"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
