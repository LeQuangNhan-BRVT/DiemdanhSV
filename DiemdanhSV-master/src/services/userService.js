import api from './api';

const userService = {
  // Lấy thông tin hồ sơ người dùng
  getUserProfile: async () => {
    try {
      const response = await api.get(`/user/profile`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể lấy thông tin hồ sơ" };
    }
  },

  // Cập nhật thông tin hồ sơ người dùng
  updateUserProfile: async (userData) => {
    try {
      const response = await api.put(`/user/profile`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể cập nhật hồ sơ" };
    }
  },

  // Đổi mật khẩu
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put(`/user/password`, {
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
      const response = await api.get('/students');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách sinh viên');
    }
  },

  // Lấy danh sách giáo viên (chỉ admin)
  getTeachers: async () => {
    try {
      const response = await api.get(`/admin/teachers`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể lấy danh sách giáo viên" };
    }
  },

  // Tạo người dùng mới (chỉ admin)
  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo người dùng mới');
    }
  },

  // Cập nhật người dùng (chỉ admin)
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật thông tin người dùng');
    }
  },

  // Xóa người dùng (chỉ admin)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xóa người dùng');
    }
  },

  // Đặt lại mật khẩu cho người dùng (chỉ admin)
  resetUserPassword: async (userId, newPassword) => {
    try {
      const response = await api.put(`/admin/users/${userId}/reset-password`, {
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Không thể đặt lại mật khẩu" };
    }
  },

  // Thêm mock data để test UI
  getMockStudents: () => {
    return [
      {
        id: 1,
        studentId: "20110001",
        name: "Nguyễn Văn A",
        email: "nguyenvana@example.com",
        class: "CTK43",
        status: "active"
      },
      {
        id: 2,
        studentId: "20110002",
        name: "Trần Thị B",
        email: "tranthib@example.com",
        class: "CTK43",
        status: "active"
      },
      {
        id: 3,
        studentId: "20110003",
        name: "Lê Văn C",
        email: "levanc@example.com",
        class: "CTK43",
        status: "inactive"
      }
    ];
  }
};

export default userService;