import React, { useState, useEffect } from 'react';
import classService from '../../services/classService';
import './ClassManagement.css';

const ClassManagement = ({ classes, onClassesUpdate }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newStudentId, setNewStudentId] = useState('');

  useEffect(() => {
    if (selectedClass) {
      loadClassDetails(selectedClass);
    }
  }, [selectedClass]);

  const loadClassDetails = async (classId) => {
    try {
      setLoading(true);
      const classDetails = await classService.getClassById(classId);
      setStudents(classDetails.students || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentId.trim() || !selectedClass) {
      setError('Vui lòng nhập MSSV và chọn lớp học');
      return;
    }

    try {
      setLoading(true);
      await classService.addStudentToClass(selectedClass, newStudentId);
      await loadClassDetails(selectedClass);
      if (onClassesUpdate) {
        await onClassesUpdate();
      }
      setNewStudentId('');
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể thêm sinh viên');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      setLoading(true);
      await classService.removeStudentFromClass(selectedClass, studentId);
      await loadClassDetails(selectedClass);
      if (onClassesUpdate) {
        await onClassesUpdate();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Không thể xóa sinh viên');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="class-management">
      <div className="class-list">
        <h2>Danh sách lớp học</h2>
        <div className="class-grid">
          {classes.map(cls => (
            <div 
              key={cls.id}
              className={`class-card ${selectedClass === cls.id ? 'selected' : ''}`}
              onClick={() => setSelectedClass(cls.id)}
            >
              <h3>{cls.name}</h3>
              <p>{cls.students?.length || 0} sinh viên</p>
            </div>
          ))}
        </div>
      </div>

      {selectedClass && (
        <div className="student-list">
          <h3>Danh sách sinh viên</h3>
          
          <form onSubmit={handleAddStudent} className="add-student-form">
            <input
              type="text"
              value={newStudentId}
              onChange={(e) => setNewStudentId(e.target.value)}
              placeholder="Nhập MSSV cần thêm"
              className="student-input"
            />
            <button 
              type="submit" 
              className="add-btn"
              disabled={loading}
            >
              {loading ? 'Đang thêm...' : 'Thêm sinh viên'}
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading">Đang tải...</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>MSSV</th>
                  <th>Họ và tên</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td>
                      <button 
                        onClick={() => handleRemoveStudent(student.id)}
                        className="remove-btn"
                        disabled={loading}
                      >
                        {loading ? 'Đang xóa...' : 'Xóa khỏi lớp'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassManagement; 