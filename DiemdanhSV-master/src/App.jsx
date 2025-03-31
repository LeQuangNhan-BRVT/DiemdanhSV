import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import SignInTeacher from './Components/Authenticate/SignInTeacher';
import SignInStudent from './Components/Authenticate/SignInStudent';
import TeacherDashboard from './Components/Teacher/TeacherDashboard';
import StudentDashboard from './Components/Student/StudentDashboard';
import AdminDashboard from './Components/Admin/AdminDashboard';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth/student/login" element={<SignInStudent />} />
          <Route path="/auth/teacher/login" element={<SignInTeacher />} />
          
          {/* Protected Student Routes */}
          <Route 
            path="/student/*" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Teacher Routes */}
          <Route 
            path="/teacher/*" 
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect root to student login */}
          <Route 
            path="/" 
            element={<Navigate to="/auth/student/login" replace />} 
          />
          
          {/* Catch all other routes */}
          <Route 
            path="*" 
            element={<Navigate to="/auth/student/login" replace />} 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;