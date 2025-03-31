import React, { useState } from 'react';
import './QRManagement.css';

const QRManagement = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [qrExpireTime, setQrExpireTime] = useState(5); // Thời gian hiệu lực của mã QR (phút)

  // Dữ liệu mẫu
  const subjects = [
    { id: 1, name: 'Lập trình Web' },
    { id: 2, name: 'Cơ sở dữ liệu' },
    { id: 3, name: 'An toàn mạng' }
  ];

  const classes = [
    { id: 1, name: 'CTK43' },
    { id: 2, name: 'CTK44' },
    { id: 3, name: 'CTK45' }
  ];

  const generateQRCode = () => {
    // Logic tạo mã QR sẽ được thêm sau
    console.log('Tạo mã QR cho:', {
      subject: selectedSubject,
      class: selectedClass,
      expireTime: qrExpireTime
    });
  };

  return (
    <div className="qr-container">
      <div className="qr-header">
        <h1>Tạo mã QR điểm danh</h1>
      </div>

      <div className="qr-content">
        <div className="qr-settings">
          <div className="form-group">
            <label>Chọn môn học:</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Chọn lớp:</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">-- Chọn lớp --</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Thời gian hiệu lực (phút):</label>
            <input 
              type="number" 
              min="1"
              max="60"
              value={qrExpireTime}
              onChange={(e) => setQrExpireTime(parseInt(e.target.value))}
            />
          </div>

          <button 
            className="generate-btn"
            onClick={generateQRCode}
            disabled={!selectedSubject || !selectedClass}
          >
            Tạo mã QR
          </button>
        </div>

        <div className="qr-display">
          <div className="qr-code-container">
            <div className="qr-placeholder">
              Mã QR sẽ hiển thị ở đây
            </div>
            <div className="qr-info">
              <p><strong>Môn học:</strong> {selectedSubject || '---'}</p>
              <p><strong>Lớp:</strong> {selectedClass || '---'}</p>
              <p><strong>Thời gian còn lại:</strong> {qrExpireTime} phút</p>
            </div>
          </div>
        </div>
      </div>

      <div className="qr-history">
        <h2>Lịch sử tạo mã QR</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Môn học</th>
              <th>Lớp</th>
              <th>Trạng thái</th>
              <th>Số sinh viên đã điểm danh</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10:30 - 15/03/2024</td>
              <td>Lập trình Web</td>
              <td>CTK43</td>
              <td><span className="status-expired">Hết hạn</span></td>
              <td>35/40</td>
            </tr>
            <tr>
              <td>08:00 - 15/03/2024</td>
              <td>Cơ sở dữ liệu</td>
              <td>CTK44</td>
              <td><span className="status-expired">Hết hạn</span></td>
              <td>38/42</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QRManagement; 