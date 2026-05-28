import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const CounsellorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Counsellor Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <div className="dashboard-grid">
        <Link to="/counsellor/queries" className="dashboard-card">
          <h3>💬 View Queries</h3>
          <p>Respond to student queries</p>
        </Link>
        <Link to="/reports" className="dashboard-card">
          <h3>📊 Reports</h3>
          <p>View feedback and statistics</p>
        </Link>
      </div>
    </div>
  );
};

export default CounsellorDashboard;