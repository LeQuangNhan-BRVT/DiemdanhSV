import api from './api';

const authService = {
    loginStudent: async (credentials) => {
        try {
            const response = await api.post('/auth/student/login', credentials);
            
            if (response.data.user && response.data.user.role !== 'student') {
                throw new Error('Tài khoản này không phải là sinh viên');
            }
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('userRole', 'student');
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Đăng nhập thất bại');
        }
    },

    loginTeacher: async (credentials) => {
        try {
            const response = await api.post('/auth/teacher/login', credentials);
            
            if (response.data.user && !['teacher', 'admin'].includes(response.data.user.role)) {
                throw new Error('Tài khoản này không có quyền truy cập');
            }
            
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                localStorage.setItem('userRole', response.data.user.role); // 'teacher' hoặc 'admin'
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.error || 'Đăng nhập thất bại');
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('refreshToken');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/refresh-token', { token: refreshToken });
        return response;
    },

    validateToken: async () => {
       
            const response = await api.get('/auth/validate');
            return response.data;
       
    }
};

export default authService;
