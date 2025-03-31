import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import QRCodeReact from "qrcode.react";
import "./QRCode.css";

const QRCode = ({ user }) => {
  const [qrValue, setQrValue] = useState("");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // Tạo mã QR chứa thông tin sinh viên
    if (user && user.mssv) {
      const studentInfo = {
        mssv: user.mssv,
        name: user.name,
        timestamp: new Date().toISOString(),
      };
      setQrValue(JSON.stringify(studentInfo));
    }

    // Cập nhật thời gian hiện tại mỗi giây
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [user]);

  const formatTime = (date) => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="qr-code-container">
      <div className="qr-header">
        <h2>Mã QR của tôi</h2>
        <p>Sử dụng mã này để điểm danh</p>
      </div>

      <div className="qr-content">
        <div className="qr-image">
          {qrValue ? (
            <QRCodeReact
              value={qrValue}
              size={250}
              level="H"
              includeMargin={true}
              renderAs="svg"
            />
          ) : (
            <div className="qr-placeholder">Đang tạo mã QR...</div>
          )}
        </div>

        <div className="qr-info">
          <div className="info-item">
            <span className="label">Thời gian:</span>
            <span className="value">{formatTime(date)}</span>
          </div>
          <div className="info-item">
            <span className="label">Ngày:</span>
            <span className="value">{formatDate(date)}</span>
          </div>
          <div className="info-item">
            <span className="label">MSSV:</span>
            <span className="value">{user?.mssv || "N/A"}</span>
          </div>
          <div className="info-item">
            <span className="label">Tên:</span>
            <span className="value">{user?.name || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="qr-note">
        <p>
          <i className="fas fa-info-circle"></i> Mã QR này được sử dụng để điểm
          danh tại các lớp học. Vui lòng giữ bí mật và không chia sẻ với người
          khác.
        </p>
      </div>
    </div>
  );
};

QRCode.propTypes = {
  user: PropTypes.shape({
    mssv: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default QRCode;
