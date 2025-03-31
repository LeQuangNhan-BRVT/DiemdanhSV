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

const classService = {
  // Lấy danh sách lớp học
  getClasses: async () => {
    try {
      const response = await authAxios.get("/classes");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Không thể lấy danh sách lớp học" }
      );
    }
  },

  // Lấy thông tin chi tiết lớp học
  getClassById: async (classId) => {
    try {
      const response = await authAxios.get(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Không thể lấy thông tin lớp học" }
      );
    }
  },

  // Tạo lớp học mới (chỉ giáo viên)
  createClass: async (classData) => {
    try {
      const response = await authAxios.post("/classes", classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể tạo lớp học" };
    }
  },

  // Cập nhật thông tin lớp học
  updateClass: async (classId, classData) => {
    try {
      const response = await authAxios.put(`/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể cập nhật lớp học" };
    }
  },

  // Xóa lớp học
  deleteClass: async (classId) => {
    try {
      const response = await authAxios.delete(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể xóa lớp học" };
    }
  },

  // Thêm sinh viên vào lớp
  addStudentToClass: async (classId, studentId) => {
    try {
      const response = await authAxios.post(`/classes/${classId}/students`, {
        studentId,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Không thể thêm sinh viên vào lớp" }
      );
    }
  },

  // Xóa sinh viên khỏi lớp
  removeStudentFromClass: async (classId, studentId) => {
    try {
      const response = await authAxios.delete(
        `/classes/${classId}/students/${studentId}`
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Không thể xóa sinh viên khỏi lớp" }
      );
    }
  },

  // Lấy danh sách sinh viên trong lớp
  getStudentsInClass: async (classId) => {
    try {
      const response = await authAxios.get(`/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Không thể lấy danh sách sinh viên" }
      );
    }
  },
};

export default classService;
