import { useAuth } from '../../context/AuthContext';

const CounsellorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Counsellor Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>💬 View Queries</h3>
          <p>Respond to student queries</p>
        </div>
        <div className="dashboard-card">
          <h3>✅ Resolved Queries</h3>
          <p>View your resolved queries</p>
        </div>
        <div className="dashboard-card">
          <h3>⭐ My Ratings</h3>
          <p>View student feedback about you</p>
        </div>
      </div>
    </div>
  );
};

export default CounsellorDashboard;