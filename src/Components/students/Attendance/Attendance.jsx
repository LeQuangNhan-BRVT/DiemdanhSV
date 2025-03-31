import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Attendance.css";
import attendanceService from "../../../services/attendanceService";

const Attendance = ({ user }) => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    subject: "",
    date: "",
    status: "all", // all, present, absent
  });

  useEffect(() => {
    if (user) {
      loadAttendanceHistory();
    }
  }, [user]);

  const loadAttendanceHistory = async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getStudentAttendanceHistory();
      setAttendanceHistory(data);
      setLoading(false);
    } catch (error) {
      setError("Không thể tải lịch sử điểm danh");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilter({
      subject: "",
      date: "",
      status: "all",
    });
  };

  const filteredHistory = attendanceHistory.filter((item) => {
    // Lọc theo môn học
    if (
      filter.subject &&
      !item.className.toLowerCase().includes(filter.subject.toLowerCase())
    ) {
      return false;
    }

    // Lọc theo ngày
    if (filter.date) {
      const itemDate = new Date(item.date).toLocaleDateString();
      const filterDate = new Date(filter.date).toLocaleDateString();
      if (itemDate !== filterDate) {
        return false;
      }
    }

    // Lọc theo trạng thái
    if (filter.status !== "all") {
      if (filter.status === "present" && !item.present) {
        return false;
      }
      if (filter.status === "absent" && item.present) {
        return false;
      }
    }

    return true;
  });

  const getAttendanceStatus = (isPresent) => {
    return isPresent
      ? { text: "Có mặt", className: "status-present" }
      : { text: "Vắng mặt", className: "status-absent" };
  };

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h2>Lịch sử điểm danh</h2>
      </div>

      <div className="filters-section">
        <div className="filter-controls">
          <div className="filter-group">
            <label>Môn học:</label>
            <input
              type="text"
              name="subject"
              value={filter.subject}
              onChange={handleFilterChange}
              placeholder="Tìm theo tên môn học"
            />
          </div>

          <div className="filter-group">
            <label>Ngày:</label>
            <input
              type="date"
              name="date"
              value={filter.date}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>Trạng thái:</label>
            <select
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="present">Có mặt</option>
              <option value="absent">Vắng mặt</option>
            </select>
          </div>

          <button className="reset-button" onClick={resetFilters}>
            <i className="fas fa-redo"></i> Đặt lại
          </button>
        </div>
      </div>

      <div className="attendance-content">
        {loading ? (
          <div className="loading">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {filteredHistory.length > 0 ? (
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Môn học</th>
                    <th>Ngày</th>
                    <th>Giờ</th>
                    <th>Trạng thái</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item, index) => {
                    const status = getAttendanceStatus(item.present);
                    return (
                      <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.className}</td>
                        <td>{new Date(item.date).toLocaleDateString()}</td>
                        <td>{new Date(item.date).toLocaleTimeString()}</td>
                        <td>
                          <span className={`status-badge ${status.className}`}>
                            {status.text}
                          </span>
                        </td>
                        <td>{item.note || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="no-data">
                <i className="fas fa-calendar-times"></i>
                <p>Không có dữ liệu điểm danh phù hợp với bộ lọc</p>
                {(filter.subject || filter.date || filter.status !== "all") && (
                  <button className="reset-button" onClick={resetFilters}>
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="attendance-summary">
        <div className="summary-item">
          <div className="summary-icon present">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="summary-info">
            <span className="summary-count">
              {attendanceHistory.filter((item) => item.present).length}
            </span>
            <span className="summary-label">Có mặt</span>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon absent">
            <i className="fas fa-times-circle"></i>
          </div>
          <div className="summary-info">
            <span className="summary-count">
              {attendanceHistory.filter((item) => !item.present).length}
            </span>
            <span className="summary-label">Vắng mặt</span>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon total">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="summary-info">
            <span className="summary-count">{attendanceHistory.length}</span>
            <span className="summary-label">Tổng số</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Attendance.propTypes = {
  user: PropTypes.shape({
    mssv: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default Attendance;
