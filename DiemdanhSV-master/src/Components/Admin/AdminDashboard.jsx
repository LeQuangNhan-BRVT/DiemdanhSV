import { useState, useEffect } from "react";
import { Button, Box, CircularProgress, Alert } from "@mui/material";
import AdminLayout from "./AdminLayout";
import TeacherTable from "./TeacherManagement/TeacherTable";
import TeacherForm from "./TeacherManagement/TeacherForm";
import SessionForm from "./ClassSession/SessionForm";
import StudentTable from "./StudentManagement/StudentTable";
import StudentForm from "./StudentManagement/StudentForm";
import userService from "../../services/userService";
import classService from "../../services/classService";
import { useAuth } from "../../hooks/useAuth";

const AdminDashboard = () => {
  useAuth(["admin"]);

  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State management
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  // Thêm state quản lý sessions
  const [sessions, setSessions] = useState([]);
  // Form states
  const [openTeacherForm, setOpenTeacherForm] = useState(false);
  const [openSessionForm, setOpenSessionForm] = useState(false);
  const [openStudentForm, setOpenStudentForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [teachersData, classesData, studentsData] = await Promise.all([
          userService.getTeachers(),
          classService.getAllClasses(),
          userService.getStudents(),
        ]);

        setTeachers(teachersData);
        setClasses(classesData);
        setStudents(studentsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }

    };
    

    fetchInitialData();
  }, []);

  const handleTeacherSubmit = async (formData) => {
    try {
      // Tạo payload chỉ chứa dữ liệu cần thiết
      const sanitizedData = {
        username: formData.username,
        email: formData.email,
        // Thêm các trường khác nếu cần, nhưng KHÔNG đưa React elements/events vào
      };
  
      let updatedTeachers;
      if (selectedTeacher) {
        // Gửi dữ liệu đã làm sạch
        const updatedTeacher = await userService.updateUser(
          selectedTeacher.id,
          sanitizedData // <-- Sử dụng sanitizedData thay vì formData
        );
        updatedTeachers = teachers.map((t) =>
          t.id === selectedTeacher.id ? updatedTeacher : t
        );
      } else {
        // Tạo mới với dữ liệu đã làm sạch
        const newTeacher = await userService.createUser({
          ...sanitizedData,
          role: "teacher",
        });
        updatedTeachers = [...teachers, newTeacher];
      }
  
      setTeachers(updatedTeachers);
      setOpenTeacherForm(false);
      setSelectedTeacher(null);
    } catch (err) {
      setError(err.message);
    }
  };

// Fetch sessions khi tạo mới
const handleSessionSubmit = async (formData) => {
  try {
    const newSession = await classService.createSession(formData);
    setSessions([...sessions, newSession]);
    setOpenSessionForm(false);
  } catch (err) {
    setError(err.message);
  }
};

  const handleStudentSubmit = async (formData) => {
    try {
      let updatedStudents;
      if (selectedStudent) {
        const updatedStudent = await userService.updateUser(
          selectedStudent.id,
          { ...formData, studentId: formData.studentId }
        );
        updatedStudents = students.map((s) =>
          s.id === selectedStudent.id ? updatedStudent : s
        );
      } else {
        const newStudent = await userService.createUser({
          ...formData,
          role: "student",
          studentId: formData.studentId,
        });
        updatedStudents = [...students, newStudent];
      }

      setStudents(updatedStudents);
      setOpenStudentForm(false);
      setSelectedStudent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await userService.deleteUser(userId);
      setTeachers(teachers.filter((t) => t.id !== userId));
      setStudents(students.filter((s) => s.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <AdminLayout value={tabValue} onChange={(e, newVal) => setTabValue(newVal)}>
      {tabValue === 0 && (
        <Box>
          <Button
            variant="contained"
            sx={{ mb: 3 }}
            onClick={() => setOpenTeacherForm(true)}
          >
            Thêm Giảng viên
          </Button>

          <TeacherTable
            teachers={teachers}
            onEdit={(teacher) => {
              setSelectedTeacher(teacher);
              setOpenTeacherForm(true);
            }}
            onDelete={handleDeleteUser}
          />

          <TeacherForm
            open={openTeacherForm}
            teacher={selectedTeacher}
            onClose={() => {
              setOpenTeacherForm(false);
              setSelectedTeacher(null);
            }}
            onSubmit={handleTeacherSubmit}
          />
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Button
            variant="contained"
            sx={{ mb: 3 }}
            onClick={() => setOpenSessionForm(true)}
          >
            Tạo Buổi học mới
          </Button>

          <SessionForm
            open={openSessionForm}
            classes={classes}
            onClose={() => setOpenSessionForm(false)}
            onSubmit={handleSessionSubmit}
          />
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Button
            variant="contained"
            sx={{ mb: 3 }}
            onClick={() => setOpenStudentForm(true)}
          >
            Thêm Sinh viên
          </Button>

          <StudentTable
            students={students}
            onEdit={(student) => {
              setSelectedStudent(student);
              setOpenStudentForm(true);
            }}
            onDelete={handleDeleteUser}
          />

          <StudentForm
            open={openStudentForm}
            student={selectedStudent}
            onClose={() => {
              setOpenStudentForm(false);
              setSelectedStudent(null);
            }}
            onSubmit={handleStudentSubmit}
          />
        </Box>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
