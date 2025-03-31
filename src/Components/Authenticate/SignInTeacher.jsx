import React, { useState } from "react";
import "../Authenticate/Teach.css"; // Đảm bảo đường dẫn chính xác
import { API_URL } from "../../config"; // Thay đổi đường dẫn file config nếu cần

export default (props) => {
  const [email, setEmail] = useState(""); // Đổi input1 thành email để rõ nghĩa
  const [password, setPassword] = useState(""); // Đổi input2 thành password
  const [error, setError] = useState(""); // Trạng thái lưu lỗi từ API
  const [loading, setLoading] = useState(false); // Xử lý trạng thái khi chờ API

  // Hàm xử lý login
  const handleLogin = async () => {
    setLoading(true);
    setError(""); // Reset lỗi trước khi bắt đầu
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: email, password }), // Body cần phù hợp với backend
      });

      if (!response.ok) {
        throw new Error("Đăng nhập thất bại! Kiểm tra email hoặc mật khẩu.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); // Lưu token vào localStorage
      alert("Đăng nhập thành công!"); // Bạn có thể chuyển hướng tại đây
      // Thực hiện callback hoặc cập nhật trạng thái người dùng
      if (props.onLogin) {
        props.onLogin(data); // Truyền thông tin người dùng lên cha
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError(err.message); // Hiển thị lỗi cho người dùng
    } finally {
      setLoading(false); // Dừng trạng thái chờ
    }
  };

  return (
    <div className="contain">
      <div
        className="view"
        style={{
          backgroundImage:
            "url(https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/275zl0or.png)",
        }}
      >
        <div className="scroll-view">
          <div className="column">
            <span className="text">{"Teacher Login"}</span>
            <div className="row-view">
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/b8dghibr.png"
                }
                className="image"
              />
              <input
                placeholder={"Email"}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="input"
              />
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/ciarjd6u.png"
                }
                className="image2"
              />
            </div>
            <div className="row-view2">
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/pkwy3bfh.png"
                }
                className="image"
              />
              <input
                type="password"
                placeholder={"Password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="input2"
              />
              <img
                src={
                  "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/889e81ut.png"
                }
                className="image3"
              />
            </div>
            {error && <p className="error-text">{error}</p>} {/* Hiển thị lỗi */}
            {loading ? (
              <div className="loading">Đang xử lý...</div>
            ) : (
              <div className="view2">
                <button className="button" onClick={handleLogin}>
                  <span className="text2">{"Login"}</span>
                </button>
              </div>
            )}
            <span className="text3">{"Forgot password?"}</span>
          </div>
          <img
            src={
              "https://storage.googleapis.com/tagjs-prod.appspot.com/8Nyf48J4UB/m0wkg73u.png"
            }
            className="absolute-image"
          />
        </div>
      </div>
    </div>
  );
};
