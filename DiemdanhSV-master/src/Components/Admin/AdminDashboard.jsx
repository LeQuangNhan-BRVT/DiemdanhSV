
import { useAuth } from '../../hooks/useAuth';

const AdminDashboard = () => {
  useAuth(['admin']); // Chỉ cho phép role admin truy cập

  // ... code khác của component
};

export default AdminDashboard; 