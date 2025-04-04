import { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Stack, 
  MenuItem,
  LocalizationProvider,
  DateTimePicker
} from '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const SessionForm = ({ open, classes, teachers, onClose, onSubmit }) => {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Tạo Buổi học mới</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TextField select label="Lớp học" fullWidth>
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField select label="Giảng viên" fullWidth>
            {teachers.map((teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.username}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Thời gian bắt đầu"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
            
            <DateTimePicker
              label="Thời gian kết thúc"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onSubmit}>
          Tạo buổi học
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionForm;