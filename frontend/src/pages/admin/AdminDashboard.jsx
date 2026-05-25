import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>🏫 Manage Colleges</h3>
          <p>Add, edit, and manage college information</p>
        </div>
        <div className="dashboard-card">
          <h3>📋 View Applications</h3>
          <p>Review student applications</p>
        </div>
        <div className="dashboard-card">
          <h3>📊 Reports</h3>
          <p>View feedback and statistics</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;