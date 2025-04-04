// src/components/Admin/StudentManagement/StudentForm.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
} from "@mui/material";

const StudentForm = ({ open, student, onClose, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {student ? "Chỉnh sửa Sinh viên" : "Thêm Sinh viên mới"}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Mã sinh viên"
            defaultValue={student?.studentId || ""}
            fullWidth
            required
          />
          <TextField
            label="Họ tên"
            defaultValue={student?.name || ""}
            fullWidth
            required
          />
          <TextField
            label="Email"
            type="email"
            defaultValue={student?.email || ""}
            fullWidth
            required
          />
          {!student && (
            <TextField label="Mật khẩu" type="password" fullWidth required />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onSubmit}>
          {student ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentForm;
