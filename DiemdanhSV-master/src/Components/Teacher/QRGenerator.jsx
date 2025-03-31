import React, { useState } from 'react';
import attendanceService from '../../services/attendanceService';
import './QRGenerator.css';

const QRGenerator = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateQR = async () => {
    if (!selectedClass) {
      setError('Vui lòng chọn lớp học');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await attendanceService.generateQR({ classId: parseInt(selectedClass) });
      setQrCode(response.qrCodeURL);
    } catch (err) {
      setError(err.message || 'Không thể tạo mã QR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-generator">
      <h2>Tạo mã QR điểm danh</h2>
      
      <div className="qr-controls">
        <select 
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="class-select"
        >
          <option value="">Chọn lớp học</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        <button 
          onClick={generateQR}
          disabled={loading || !selectedClass}
          className="generate-btn"
        >
          {loading ? 'Đang tạo...' : 'Tạo mã QR'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {qrCode && (
        <div className="qr-display">
          <img src={qrCode} alt="QR Code" />
          <p className="qr-note">
            Mã QR có hiệu lực trong 15 phút.
            <br />
            Sinh viên quét mã này để điểm danh.
          </p>
        </div>
      )}
    </div>
  );
};

export default QRGenerator; 