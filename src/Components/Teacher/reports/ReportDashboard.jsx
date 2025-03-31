import React from 'react';
import './ReportDashboard.css';

const ReportDashboard = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>Báo cáo & Thống kê</h1>
      </div>

      <div className="report-filters">
        <select className="filter-select">
          <option value="">Chọn loại báo cáo</option>
          <option value="performance">Kết quả học tập</option>
          <option value="attendance">Điểm danh</option>
          <option value="overview">Tổng quan</option>
        </select>
        <select className="filter-select">
          <option value="">Chọn lớp</option>
          <option value="CTK43">CTK43</option>
        </select>
        <select className="filter-select">
          <option value="">Học kỳ</option>
          <option value="1">Học kỳ 1</option>
          <option value="2">Học kỳ 2</option>
        </select>
        <button className="generate-btn">Tạo báo cáo</button>
      </div>

      <div className="report-cards">
        <div className="report-card">
          <h3>Tổng số sinh viên</h3>
          <div className="stat">120</div>
        </div>
        <div className="report-card">
          <h3>Điểm trung bình</h3>
          <div className="stat">7.5</div>
        </div>
        <div className="report-card">
          <h3>Tỷ lệ đạt</h3>
          <div className="stat">85%</div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Biểu đồ phân bố điểm</h2>
        <div className="chart-placeholder">
          [Biểu đồ sẽ được hiển thị ở đây]
        </div>
      </div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Loại</th>
            <th>Số lượng</th>
            <th>Tỷ lệ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Xuất sắc</td>
            <td>15</td>
            <td>12.5%</td>
          </tr>
          <tr>
            <td>Giỏi</td>
            <td>30</td>
            <td>25%</td>
          </tr>
          <tr>
            <td>Khá</td>
            <td>45</td>
            <td>37.5%</td>
          </tr>
          <tr>
            <td>Trung bình</td>
            <td>20</td>
            <td>16.7%</td>
          </tr>
          <tr>
            <td>Yếu</td>
            <td>10</td>
            <td>8.3%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ReportDashboard; 