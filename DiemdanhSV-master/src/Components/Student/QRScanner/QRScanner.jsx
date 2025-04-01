import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../../services/api';
import './QRScanner.css';

const QRScanner = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [lastScanTime, setLastScanTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  // Xử lý khi component mount
  useEffect(() => {
    setIsVisible(true);
    return () => {
      setIsVisible(false);
    };
  }, []);

  // Xử lý khi tab thay đổi
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    if (!isVisible || !isScanning) {
      if (scanner) {
        scanner.clear();
        setScanner(null);
      }
      return;
    }

    const qrScanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    setScanner(qrScanner);

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
        qrScanner.pause();
        
        setTimeout(() => {
          setSuccess(null);
          qrScanner.resume();
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

    qrScanner.render(onScanSuccess, (err) => {
      console.error('Scanner error:', err);
      setError('Không thể truy cập camera');
    });

    return () => {
      if (qrScanner) {
        qrScanner.clear();
        setScanner(null);
      }
    };
  }, [lastScanTime, isVisible, isScanning]);

  const toggleScanner = () => {
    if (isScanning) {
      setIsScanning(false);
      setIsVisible(false);
    } else {
      setIsScanning(true);
      setIsVisible(true);
    }
  };

  return (
    <div className="qr-scanner-container">
      <h2>Quét mã QR để điểm danh</h2>
      
      <button 
        className={`scanner-toggle-btn ${isScanning ? 'active' : ''}`}
        onClick={toggleScanner}
      >
        {isScanning ? 'Tắt Camera' : 'Bật Camera'}
      </button>

      {isVisible && isScanning && (
        <div id="reader" className="scanner-wrapper"></div>
      )}

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