import React, { useState } from "react";
import "./StudentDashboard.css";
import QRCode from "./QRCode/QRCode";
import Profile from "./Profile/Profile";
import Attendance from "./Attendance/Attendance";
import Schedule from "./Schedule/Schedule";
import QRScanner from "./QRScanner/QRScanner";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("qr");

  const renderContent = () => {
    switch (activeTab) {
      case "qr":
        return <QRCode />;
      case "profile":
        return <Profile />;
      case "attendance":
        return <Attendance />;
      case "schedule":
        return <Schedule />;
      case "scanner":
        return <QRScanner />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <div className="logo">
          <i className="fas fa-graduation-cap"></i>
          <h2>Điểm Danh Sinh Viên</h2>
        </div>
        <div className="user-info">
          <div className="user-details">
            <i className="fas fa-user"></i>
            <span>Trần Trọng Nhân</span>
          </div>
          <button className="logout-button">
            <i className="fas fa-sign-out-alt"></i>
            Đăng xuất
          </button>
        </div>
      </div>
      <div className="main-layout">
        <div className="navigation">
          <button
            className={`nav-button ${activeTab === "qr" ? "active" : ""}`}
            onClick={() => setActiveTab("qr")}
          >
            <i className="fas fa-qrcode"></i>
            Mã QR của tôi
          </button>
          <button
            className={`nav-button ${activeTab === "scanner" ? "active" : ""}`}
            onClick={() => setActiveTab("scanner")}
          >
            <i className="fas fa-camera"></i>
            Quét mã QR
          </button>
          <button
            className={`nav-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="fas fa-user-circle"></i>
            Thông tin cá nhân
          </button>
          <button
            className={`nav-button ${
              activeTab === "attendance" ? "active" : ""
            }`}
            onClick={() => setActiveTab("attendance")}
          >
            <i className="fas fa-clipboard-check"></i>
            Điểm danh
          </button>
          <button
            className={`nav-button ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            <i className="fas fa-calendar-alt"></i>
            Thời khóa biểu
          </button>
        </div>
        <div className="main-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default StudentDashboard;
