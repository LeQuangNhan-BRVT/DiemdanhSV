import React, { useState } from "react";
import { Button, Dialog, MenuItem, TextField } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SessionForm = ({ open, classes, teachers, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    classId: "",
    teacherId: "",
    startTime: new Date(),
    endTime: new Date(),
  });

  const handleSubmit = () => {
    onSubmit({
      ...formData,
      startTime: formData.startTime.toISOString(),
      endTime: formData.endTime.toISOString()
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <div style={{ padding: 20 }}>
        {/* Chọn lớp học */}
        <TextField
          select
          fullWidth
          label="Lớp học"
          value={formData.classId}
          onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
          margin="normal"
        >
         {(classes || []).map((cls) => ( // <-- Fallback về mảng rỗng nếu undefined
  <MenuItem key={cls.id} value={cls.id}>
    {cls.name}
  </MenuItem>
))}
        </TextField>

        {/* Chọn giáo viên */}
        <TextField
          select
          fullWidth
          label="Giáo viên"
          value={formData.teacherId}
          onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
          margin="normal"
        >
          {(teachers || []).map((teacher) => (
  <MenuItem key={teacher.id} value={teacher.id}>
    {teacher.name}
  </MenuItem>
))}
        </TextField>

        {/* Chọn thời gian với React Datepicker */}
        <DatePicker
          selected={formData.startTime}
          onChange={(date) => setFormData({ ...formData, startTime: date })}
          showTimeSelect
          dateFormat="dd/MM/yyyy HH:mm"
          customInput={
            <TextField
              fullWidth
              margin="normal"
              label="Thời gian bắt đầu"
            />
          }
        />

        <DatePicker
          selected={formData.endTime}
          onChange={(date) => setFormData({ ...formData, endTime: date })}
          showTimeSelect
          dateFormat="dd/MM/yyyy HH:mm"
          customInput={
            <TextField
              fullWidth
              margin="normal"
              label="Thời gian kết thúc"
            />
          }
        />

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          style={{ marginTop: 20 }}
        >
          Tạo buổi học
        </Button>
      </div>
    </Dialog>
  );
};

export default SessionForm;