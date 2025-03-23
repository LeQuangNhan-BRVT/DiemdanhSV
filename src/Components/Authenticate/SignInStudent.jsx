import React, { useState } from "react";
import "./Stu.css";

export default (props) => {
  const [input1, setInput1] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Add your login logic here
    alert("Login attempted with MSSV: " + input1);
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

              <button className="login-button" onClick={handleLogin}>
                <span className="button-text">Đăng nhập</span>
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
