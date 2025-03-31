import api from './api';

const attendanceService = {
  generateQR: async (data) => {
    const response = await api.post('/attendance/generate-qr', data);
    return response.data;
  },

  checkIn: async (data) => {
    const response = await api.post('/attendance/check-in', data);
    return response.data;
  },

  getStudentHistory: async () => {
    const response = await api.get('/attendance/my-history');
    return response.data;
  },

  getStudentClassHistory: async (classId) => {
    const response = await api.get(`/attendance/history/${classId}`);
    return response.data;
  },

  // Lấy báo cáo điểm danh cho lớp học (giáo viên)
  getClassAttendanceReport: async (classId, date) => {
    try {
      const response = await api.get(`/attendance/report/${classId}`, {
        params: { date },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Không thể lấy báo cáo điểm danh" }
      );
    }
  },

  // Lấy danh sách sinh viên có mặt trong buổi học
  getPresentStudents: async (classId, date) => {
    try {
      const response = await api.get(`/attendance/present/${classId}`, {
        params: { date },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Không thể lấy danh sách sinh viên có mặt",
        }
      );
    }
  },

  // Lấy danh sách sinh viên vắng mặt trong buổi học
  getAbsentStudents: async (classId, date) => {
    try {
      const response = await api.get(`/attendance/absent/${classId}`, {
        params: { date },
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Không thể lấy danh sách sinh viên vắng mặt",
        }
      );
    }
  },

  // Thêm điểm danh thủ công cho sinh viên (giáo viên)
  addManualAttendance: async (classId, studentId, date) => {
    try {
      const response = await api.post(`/attendance/manual`, {
        classId,
        studentId,
        date,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Không thể thêm điểm danh thủ công" }
      );
    }
  },

  // Xóa điểm danh của sinh viên (giáo viên)
  removeAttendance: async (attendanceId) => {
    try {
      const response = await api.delete(`/attendance/${attendanceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể xóa điểm danh" };
    }
  },
};

export default attendanceService;
