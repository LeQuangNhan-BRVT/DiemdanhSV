import { Box, Tabs, Tab, Container } from "@mui/material";
import { useState } from "react";

const AdminLayout = ({ children, value, onChange }) => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 4 }}>
        <Tabs value={value} onChange={onChange}>
          <Tab label="Quản lý Giảng viên" />
          <Tab label="Tạo Buổi học" />
          <Tab label="Quản lý sinh viên"/>
        </Tabs>
      </Box>
      {children}
    </Container>
  );
};

export default AdminLayout;
