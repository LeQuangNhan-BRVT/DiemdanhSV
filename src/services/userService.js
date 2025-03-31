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

const userService = {
  // Lấy thông tin hồ sơ người dùng
  getUserProfile: async () => {
    try {
      const response = await authAxios.get(`/user/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể lấy thông tin hồ sơ" };
    }
  },

  // Cập nhật thông tin hồ sơ người dùng
  updateUserProfile: async (userData) => {
    try {
      const response = await authAxios.put(`/user/profile`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể cập nhật hồ sơ" };
    }
  },

  // Đổi mật khẩu
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await authAxios.put(`/user/password`, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể đổi mật khẩu" };
    }
  },

  // Lấy danh sách sinh viên (chỉ admin hoặc giáo viên)
  getStudents: async () => {
    try {
      const response = await authAxios.get(`/admin/students`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể lấy danh sách sinh viên" };
    }
  },

  // Lấy danh sách giáo viên (chỉ admin)
  getTeachers: async () => {
    try {
      const response = await authAxios.get(`/admin/teachers`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể lấy danh sách giáo viên" };
    }
  },

  // Tạo người dùng mới (chỉ admin)
  createUser: async (userData) => {
    try {
      const response = await authAxios.post(`/admin/users`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể tạo người dùng mới" };
    }
  },

  // Cập nhật người dùng (chỉ admin)
  updateUser: async (userId, userData) => {
    try {
      const response = await authAxios.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể cập nhật người dùng" };
    }
  },

  // Xóa người dùng (chỉ admin)
  deleteUser: async (userId) => {
    try {
      const response = await authAxios.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể xóa người dùng" };
    }
  },

  // Đặt lại mật khẩu cho người dùng (chỉ admin)
  resetUserPassword: async (userId, newPassword) => {
    try {
      const response = await authAxios.put(`/admin/users/${userId}/reset-password`, {
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể đặt lại mật khẩu" };
    }
  },
};

export default userService;