import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Schedule.css";
import classService from "../../../services/classService";

const Schedule = ({ user }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  useEffect(() => {
    if (user) {
      loadClasses();
    }
  }, [user]);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getClasses();
      setClasses(data);
      setLoading(false);
    } catch (error) {
      setError("Không thể tải danh sách lớp học");
      setLoading(false);
    }
  };

  // Lọc lớp học theo ngày được chọn
  const filteredClasses = classes.filter((classItem) => {
    // Giả sử mỗi lớp có thuộc tính 'schedules' chứa thông tin lịch học
    // và mỗi lịch học có thuộc tính 'dayOfWeek' (0-6 tương ứng với CN-T7)
    return (
      classItem.schedules &&
      classItem.schedules.some((schedule) => schedule.dayOfWeek === selectedDay)
    );
  });

  return (
    <div className="schedule-container">
      <div className="schedule-header">
        <h2>Thời khóa biểu</h2>
      </div>

      <div className="day-selector">
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            className={`day-button ${selectedDay === index ? "active" : ""}`}
            onClick={() => setSelectedDay(index)}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="schedule-content">
        {loading ? (
          <div className="loading">Đang tải lịch học...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <>
            {filteredClasses.length > 0 ? (
              <div className="classes-list">
                {filteredClasses.map((classItem) => {
                  // Lấy các lịch học của lớp này vào ngày đã chọn
                  const daySchedules = classItem.schedules.filter(
                    (schedule) => schedule.dayOfWeek === selectedDay
                  );

                  return daySchedules.map((schedule) => (
                    <div
                      className="class-card"
                      key={`${classItem.id}-${schedule.id}`}
                    >
                      <div className="class-header">
                        <h3>{classItem.name}</h3>
                        <span className="class-time">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                      <div className="class-details">
                        <div className="info-row">
                          <i className="fas fa-user-tie"></i>
                          <span>Giảng viên: {classItem.teacherName}</span>
                        </div>
                        <div className="info-row">
                          <i className="fas fa-map-marker-alt"></i>
                          <span>Phòng: {schedule.room || "Chưa cập nhật"}</span>
                        </div>
                        <div className="info-row">
                          <i className="fas fa-calendar-alt"></i>
                          <span>
                            {daysOfWeek[schedule.dayOfWeek]},{" "}
                            {schedule.startTime} - {schedule.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ));
                })}
              </div>
            ) : (
              <div className="no-classes">
                <i className="fas fa-calendar-times"></i>
                <p>Không có lớp học vào {daysOfWeek[selectedDay]}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="schedule-footer">
        <div className="schedule-legend">
          <div className="legend-item">
            <span className="color-box ongoing"></span>
            <span>Đang diễn ra</span>
          </div>
          <div className="legend-item">
            <span className="color-box upcoming"></span>
            <span>Sắp tới</span>
          </div>
          <div className="legend-item">
            <span className="color-box completed"></span>
            <span>Đã hoàn thành</span>
          </div>
        </div>
      </div>
    </div>
  );
};

Schedule.propTypes = {
  user: PropTypes.shape({
    mssv: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default Schedule;
