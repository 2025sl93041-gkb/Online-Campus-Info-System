import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <div className="dashboard-grid">
        <Link to="/admin/colleges" className="dashboard-card">
          <h3>🏫 Manage Colleges</h3>
          <p>Add, edit, and manage college information</p>
        </Link>
        <Link to="/admin/counsellors" className="dashboard-card">
          <h3>👨‍💼 Manage Counsellors</h3>
          <p>Assign counsellors to colleges</p>
        </Link>
        <Link to="/admin/applications" className="dashboard-card">
          <h3>📋 View Applications</h3>
          <p>Review student applications</p>
        </Link>
        <Link to="/reports" className="dashboard-card">
          <h3>📊 Reports</h3>
          <p>View comprehensive system reports</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;