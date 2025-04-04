// src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import { Edit, Delete, Add, Schedule, Person } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [openTeacherForm, setOpenTeacherForm] = useState(false);
  const [openSessionForm, setOpenSessionForm] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [sessionData, setSessionData] = useState({
    start: new Date(),
    end: new Date(),
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teachersRes, classesRes] = await Promise.all([
          fetch("/api/admin/users?role=teacher"),
          fetch("/api/classes"),
        ]);

        setTeachers(await teachersRes.json());
        setClasses(await classesRes.json());
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  // Xử lý giáo viên
  const handleTeacherSubmit = async (formData) => {
    try {
      const url = selectedTeacher
        ? `/api/admin/users/${selectedTeacher.id}`
        : "/api/admin/users";

      const response = await fetch(url, {
        method: selectedTeacher ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...formData,
          role: "teacher",
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      setOpenTeacherForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // Xử lý buổi học
  const handleSessionSubmit = async () => {
    try {
      const response = await fetch("/api/classes/schedules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...sessionData,
          classId: sessionData.selectedClass,
          teacherId: sessionData.selectedTeacher,
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      setOpenSessionForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  return (
    <Container maxWidth="xl">
      {/* Phần layout chung */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newVal) => setTabValue(newVal)}
          variant="fullWidth"
        >
          <Tab label="Quản lý Giảng viên" icon={<Person />} />
          <Tab label="Tạo Buổi học" icon={<Schedule />} />
        </Tabs>
      </Box>

      {/* Nội dung theo tab */}
      {tabValue === 0 && (
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ mb: 3 }}
            onClick={() => setOpenTeacherForm(true)}
          >
            Thêm Giảng viên
          </Button>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tên đăng nhập</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.username}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          color: teacher.isActive
                            ? "success.main"
                            : "error.main",
                          fontWeight: "bold",
                        }}
                      >
                        {teacher.isActive ? "Hoạt động" : "Vô hiệu"}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setOpenTeacherForm(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          if (window.confirm("Xác nhận xóa giảng viên?")) {
                            // Xử lý xóa
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Form giáo viên */}
          <Dialog
            open={openTeacherForm}
            onClose={() => setOpenTeacherForm(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>
              {selectedTeacher ? "Chỉnh sửa Giảng viên" : "Thêm Giảng viên mới"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  label="Tên đăng nhập"
                  defaultValue={selectedTeacher?.username || ""}
                  fullWidth
                  required
                />

                <TextField
                  label="Email"
                  type="email"
                  defaultValue={selectedTeacher?.email || ""}
                  fullWidth
                  required
                />

                {!selectedTeacher && (
                  <TextField
                    label="Mật khẩu"
                    type="password"
                    fullWidth
                    required
                  />
                )}
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenTeacherForm(false)}>Hủy</Button>
              <Button
                variant="contained"
                onClick={() =>
                  handleTeacherSubmit({
                    // Lấy dữ liệu từ form
                  })
                }
              >
                {selectedTeacher ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}

      {tabValue === 1 && (
        <Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ mb: 3 }}
            onClick={() => setOpenSessionForm(true)}
          >
            Tạo Buổi học mới
          </Button>

          {/* Form tạo buổi học */}
          <Dialog
            open={openSessionForm}
            onClose={() => setOpenSessionForm(false)}
            fullWidth
            maxWidth="md"
          >
            <DialogTitle>Tạo Buổi học mới</DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <TextField
                  select
                  label="Lớp học"
                  fullWidth
                  value={sessionData.selectedClass || ""}
                  onChange={(e) =>
                    setSessionData((prev) => ({
                      ...prev,
                      selectedClass: e.target.value,
                    }))
                  }
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  label="Giảng viên"
                  fullWidth
                  value={sessionData.selectedTeacher || ""}
                  onChange={(e) =>
                    setSessionData((prev) => ({
                      ...prev,
                      selectedTeacher: e.target.value,
                    }))
                  }
                >
                  {teachers.map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.username}
                    </MenuItem>
                  ))}
                </TextField>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Thời gian bắt đầu"
                    value={sessionData.start}
                    onChange={(newValue) =>
                      setSessionData((prev) => ({
                        ...prev,
                        start: newValue,
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />

                  <DateTimePicker
                    label="Thời gian kết thúc"
                    value={sessionData.end}
                    onChange={(newValue) =>
                      setSessionData((prev) => ({
                        ...prev,
                        end: newValue,
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenSessionForm(false)}>Hủy</Button>
              <Button variant="contained" onClick={handleSessionSubmit}>
                Tạo buổi học
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Container>
  );
};

export default AdminDashboard;
