import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { QrReader } from "react-qr-reader";
import "./QRScanner.css";
import attendanceService from "../../../services/attendanceService";

const QRScanner = ({ user }) => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [scanStatus, setScanStatus] = useState(null); // success, error
  const [message, setMessage] = useState("");
  const [lastScan, setLastScan] = useState(null);

  useEffect(() => {
    // Reset status sau 5 giây
    if (scanStatus) {
      const timer = setTimeout(() => {
        setScanStatus(null);
        setMessage("");
        setResult(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [scanStatus]);

  const handleScan = async (data) => {
    if (data && !scanStatus) {
      setScanning(false);
      setResult(data);

      try {
        // Tránh quét nhiều lần trong khoảng thời gian ngắn
        const now = new Date().getTime();
        if (lastScan && now - lastScan < 3000) {
          return;
        }
        setLastScan(now);

        // Gửi dữ liệu QR lên server để điểm danh
        const response = await attendanceService.checkInWithQR(data);
        setScanStatus("success");
        setMessage("Điểm danh thành công!");
      } catch (error) {
        setScanStatus("error");
        setMessage(error.message || "Điểm danh thất bại. Vui lòng thử lại.");
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setScanStatus("error");
    setMessage("Lỗi khi quét mã QR. Vui lòng thử lại.");
  };

  const startScanning = () => {
    setScanning(true);
    setResult(null);
    setScanStatus(null);
    setMessage("");
  };

  const stopScanning = () => {
    setScanning(false);
  };

  return (
    <div className="qr-scanner-container">
      <div className="scanner-header">
        <h2>Quét mã QR</h2>
        <p>Quét mã QR từ giáo viên để điểm danh</p>
      </div>

      <div className="scanner-content">
        {scanning ? (
          <div className="scanner-camera">
            <QrReader
              delay={300}
              onResult={handleScan}
              onError={handleError}
              constraints={{ facingMode: "environment" }}
              style={{ width: "100%" }}
            />
            <button className="cancel-button" onClick={stopScanning}>
              <i className="fas fa-times"></i> Dừng quét
            </button>
          </div>
        ) : (
          <div className="scanner-placeholder">
            {scanStatus ? (
              <div className={`scan-result ${scanStatus}`}>
                <i
                  className={`fas fa-${
                    scanStatus === "success"
                      ? "check-circle"
                      : "exclamation-circle"
                  }`}
                ></i>
                <p>{message}</p>
              </div>
            ) : (
              <>
                <i className="fas fa-camera"></i>
                <p>Nhấn nút bên dưới để bắt đầu quét mã QR</p>
                <button className="scan-button" onClick={startScanning}>
                  <i className="fas fa-qrcode"></i> Bắt đầu quét
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="scanner-info">
        <div className="info-card">
          <h3>
            <i className="fas fa-info-circle"></i> Hướng dẫn
          </h3>
          <ol>
            <li>Nhấn "Bắt đầu quét" để mở máy ảnh</li>
            <li>Đặt mã QR của giáo viên trong khung hình</li>
            <li>Giữ điện thoại ổn định đến khi quét thành công</li>
            <li>Kết quả điểm danh sẽ hiển thị ngay sau khi quét</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

QRScanner.propTypes = {
  user: PropTypes.shape({
    mssv: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default QRScanner;
