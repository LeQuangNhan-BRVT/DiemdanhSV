import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const TeacherTable = ({ teachers, onEdit, onDelete }) => {
  return (
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
                <span style={{ 
                  color: teacher.isActive ? '#4CAF50' : '#F44336',
                  fontWeight: 'bold'
                }}>
                  {teacher.isActive ? 'Hoạt động' : 'Vô hiệu'}
                </span>
              </TableCell>
              <TableCell>
                <IconButton onClick={() => onEdit(teacher)}>
                  <Edit color="primary" />
                </IconButton>
                <IconButton onClick={() => onDelete(teacher.id)}>
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

export default TeacherTable;