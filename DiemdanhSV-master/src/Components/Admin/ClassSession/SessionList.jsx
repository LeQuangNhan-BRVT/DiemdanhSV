// src/components/Admin/ClassSession/SessionList.jsx
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const SessionList = ({ sessions }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Lớp học</TableCell>
            <TableCell>Thời gian bắt đầu</TableCell>
            <TableCell>Thời gian kết thúc</TableCell>
            <TableCell>Thao tác</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>{session.className}</TableCell>
              <TableCell>{new Date(session.startTime).toLocaleString()}</TableCell>
              <TableCell>{new Date(session.endTime).toLocaleString()}</TableCell>
              <TableCell>
                <IconButton>
                  <Edit color="primary" />
                </IconButton>
                <IconButton>
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

export default SessionList;