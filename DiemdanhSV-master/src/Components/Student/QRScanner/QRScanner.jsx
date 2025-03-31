import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../../services/api';
import './QRScanner.css';

const QRScanner = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    const onScanSuccess = async (decodedText) => {
      try {
        const currentTime = Date.now();
        if (currentTime - lastScanTime < 3000) {
          return;
        }
        setLastScanTime(currentTime);

        console.log('QR Data scanned:', decodedText);
        
        let qrData;
        try {
          qrData = JSON.parse(decodedText);
          console.log('Parsed QR data:', qrData);
        } catch (error) {
          console.error('QR Parse error:', error);
          setError('Mã QR không hợp lệ');
          return;
        }

        // Gửi request điểm danh
        const response = await api.post('/api/attendance/check-in', {
          qrData: decodedText // Gửi nguyên dữ liệu QR
        });

        console.log('Check-in response:', response.data);
        setSuccess(response.data.message || 'Điểm danh thành công!');
        setError(null);
        
        // Tạm dừng scanner
        scanner.pause();
        
        setTimeout(() => {
          setSuccess(null);
          scanner.resume();
        }, 3000);

      } catch (err) {
        console.error('Check-in error:', err);
        
        if (err.response) {
          switch (err.response.status) {
            case 400:
              setError(err.response.data.error || 'Mã QR không hợp lệ hoặc đã hết hạn');
              break;
            case 401:
              setError('Vui lòng đăng nhập lại');
              setTimeout(() => {
                window.location.href = '/auth/student/login';
              }, 2000);
              break;
            case 403:
              setError('Bạn không thuộc lớp học này');
              break;
            default:
              setError(err.response.data.error || 'Không thể điểm danh. Vui lòng thử lại');
          }
        } else {
          setError('Lỗi kết nối. Vui lòng thử lại');
        }

        setTimeout(() => {
          setError(null);
        }, 3000);
      }
    };

    scanner.render(onScanSuccess, (err) => {
      console.error('Scanner error:', err);
      setError('Không thể truy cập camera');
    });

    return () => {
      scanner.clear();
    };
  }, [lastScanTime]);

  return (
    <div className="qr-scanner-container">
      <h2>Quét mã QR để điểm danh</h2>
      
      <div id="reader" className="scanner-wrapper"></div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}
    </div>
  );
};

export default QRScanner;