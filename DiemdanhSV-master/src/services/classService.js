import api from './api';

const classService = {
  getAllClasses: async () => {
    const response = await api.get('/classes');
    return response.data;
  },

  getClassById: async (classId) => {
    const response = await api.get(`/classes/${classId}`);
    return response.data;
  },

  addStudentToClass: async (classId, studentId) => {
    const response = await api.post(`/classes/${classId}/students/${studentId}`);
    return response.data;
  },

  removeStudentFromClass: async (classId, studentId) => {
    const response = await api.delete(`/classes/${classId}/students/${studentId}`);
    return response.data;
  },

  getClassSchedules: async (classId) => {
    const response = await api.get(`/classes/${classId}/schedules`);
    return response.data;
  },

  createSchedule: async (classId, scheduleData) => {
    const response = await api.post(`/classes/${classId}/schedules`, scheduleData);
    return response.data;
  },

  updateSchedule: async (classId, scheduleId, scheduleData) => {
    const response = await api.put(`/classes/${classId}/schedules/${scheduleId}`, scheduleData);
    return response.data;
  },

  deleteSchedule: async (classId, scheduleId) => {
    const response = await api.delete(`/classes/${classId}/schedules/${scheduleId}`);
    return response.data;
  },

  createClass: async (classData) => {
    try {
      const response = await api.post('/classes', classData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể tạo lớp học mới');
    }
  },

  updateClass: async (classId, classData) => {
    try {
      const response = await api.put(`/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể cập nhật lớp học');
    }
  },

  deleteClass: async (classId) => {
    try {
      const response = await api.delete(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Không thể xóa lớp học');
    }
  }
};

export default classService;