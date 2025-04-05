import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";

const TeacherForm = ({ open, teacher, onClose, onSubmit }) => {
  // Khởi tạo state form với giá trị mặc định
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Reset form khi mở dialog hoặc teacher thay đổi
  useEffect(() => {
    if (teacher) {
      setFormData({
        username: teacher.username,
        email: teacher.email,
        password: "", // Không hiển thị password cũ
      });
    } else {
      setFormData({ username: "", email: "", password: "" });
    }
  }, [teacher, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      role: "teacher",
    };

    if (!teacher) {
      payload.password = formData.password;
    }
    // Validate cơ bản
    if (!payload.username || !payload.email) {
      return alert("Vui lòng điền đầy đủ thông tin");
    }

    onSubmit({
      ...payload,
      id: teacher?.id,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {teacher ? "Chỉnh sửa Giảng viên" : "Thêm Giảng viên mới"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            name="username"
            label="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />

          <TextField
            name="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />

          {!teacher && (
            <TextField
              name="password"
              label="Mật khẩu"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={
            !formData.username ||
            !formData.email ||
            (!teacher && !formData.password)
          }
        >
          {teacher ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherForm;
