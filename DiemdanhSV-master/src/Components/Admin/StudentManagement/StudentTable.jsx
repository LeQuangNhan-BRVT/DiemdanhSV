// src/components/Admin/StudentManagement/StudentTable.jsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const StudentTable = ({ students, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã SV</TableCell>
            <TableCell>Họ tên</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.studentId}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>
                <span style={{ 
                  color: student.isActive ? '#4CAF50' : '#F44336',
                  fontWeight: 'bold'
                }}>
                  {student.isActive ? 'Hoạt động' : 'Vô hiệu'}
                </span>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(student)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => onDelete(student.id)}>
                  <Delete color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentTable;