import axios from "axios";

const API_URL = "http://localhost:5000";

// Tạo instance axios với interceptor để thêm token vào header
const authAxios = axios.create({
  baseURL: API_URL,
});

// Thêm interceptor để đính kèm token vào mỗi request
authAxios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const attendanceService = {
  // Tạo mã QR cho điểm danh (giáo viên)
  generateQRCode: async (classId) => {
    try {
      const response = await authAxios.post(`/attendance/generate-qr`, {
        classId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể tạo mã QR" };
    }
  },

  // Sinh viên điểm danh bằng mã QR
  checkInWithQR: async (qrData) => {
    try {
      const response = await authAxios.post(`/attendance/check-in`, { qrData });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Điểm danh thất bại" };
    }
  },

  // Lấy lịch sử điểm danh của sinh viên
  getStudentAttendanceHistory: async () => {
    try {
      const response = await authAxios.get(`/attendance/history`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Không thể lấy lịch sử điểm danh" }
      );
    }
  },

  // Lấy báo cáo điểm danh cho lớp học (giáo viên)
  getClassAttendanceReport: async (classId, date) => {
    try {
      const response = await authAxios.get(`/attendance/report/${classId}`, {
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
      const response = await authAxios.get(`/attendance/present/${classId}`, {
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
      const response = await authAxios.get(`/attendance/absent/${classId}`, {
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
      const response = await authAxios.post(`/attendance/manual`, {
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
      const response = await authAxios.delete(`/attendance/${attendanceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể xóa điểm danh" };
    }
  },
};

export default attendanceService;
