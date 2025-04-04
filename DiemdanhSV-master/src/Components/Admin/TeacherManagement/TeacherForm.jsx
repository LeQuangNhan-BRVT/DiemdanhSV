import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Stack } from '@mui/material';

const TeacherForm = ({ open, teacher, onClose, onSubmit }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{teacher ? "Chỉnh sửa Giảng viên" : "Thêm Giảng viên mới"}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField
            label="Tên đăng nhập"
            defaultValue={teacher?.username || ''}
            fullWidth
            required
          />
          
          <TextField
            label="Email"
            type="email"
            defaultValue={teacher?.email || ''}
            fullWidth
            required
          />
          
          {!teacher && (
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
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onSubmit}>
          {teacher ? "Cập nhật" : "Thêm mới"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeacherForm;