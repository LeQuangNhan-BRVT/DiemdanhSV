import React, { useState, useEffect } from 'react';
import classService from '../../services/classService';
import './ScheduleManagement.css';

const ScheduleManagement = ({ classes }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    dayOfWeek: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    if (selectedClass) {
      loadSchedules(selectedClass);
    }
  }, [selectedClass]);

  const loadSchedules = async (classId) => {
    try {
      setLoading(true);
      const response = await classService.getClassSchedules(classId);
      setSchedules(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    if (!selectedClass) return;

    try {
      await classService.createSchedule(selectedClass, newSchedule);
      await loadSchedules(selectedClass);
      setNewSchedule({ dayOfWeek: '', startTime: '', endTime: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await classService.deleteSchedule(selectedClass, scheduleId);
      await loadSchedules(selectedClass);
    } catch (err) {
      setError(err.message);
    }
  };

  const getDayName = (day) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[day];
  };

  return (
    <div className="schedule-management">
      <div className="class-selector">
        <h2>Quản lý lịch học</h2>
        <select 
          value={selectedClass || ''}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Chọn lớp học</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {selectedClass && (
        <>
          <form onSubmit={handleAddSchedule} className="schedule-form">
            <h3>Thêm lịch học mới</h3>
            <div className="form-group">
              <select
                value={newSchedule.dayOfWeek}
                onChange={(e) => setNewSchedule({...newSchedule, dayOfWeek: e.target.value})}
                required
              >
                <option value="">Chọn thứ</option>
                {[0,1,2,3,4,5,6].map(day => (
                  <option key={day} value={day}>{getDayName(day)}</option>
                ))}
              </select>
              <input
                type="time"
                value={newSchedule.startTime}
                onChange={(e) => setNewSchedule({...newSchedule, startTime: e.target.value})}
                required
              />
              <input
                type="time"
                value={newSchedule.endTime}
                onChange={(e) => setNewSchedule({...newSchedule, endTime: e.target.value})}
                required
              />
              <button type="submit">Thêm</button>
            </div>
          </form>

          <div className="schedule-list">
            <h3>Lịch học hiện tại</h3>
            {loading ? (
              <div className="loading">Đang tải...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Thứ</th>
                    <th>Giờ bắt đầu</th>
                    <th>Giờ kết thúc</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td>{getDayName(schedule.dayOfWeek)}</td>
                      <td>{schedule.startTime}</td>
                      <td>{schedule.endTime}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="delete-btn"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ScheduleManagement; 