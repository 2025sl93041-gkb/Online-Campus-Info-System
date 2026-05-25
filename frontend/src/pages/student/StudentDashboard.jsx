import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <div className="dashboard-grid">
        <Link to="/colleges" className="dashboard-card">
          <h3>📚 Browse Colleges</h3>
          <p>Explore colleges and courses</p>
        </Link>
        <div className="dashboard-card">
          <h3>📝 My Applications</h3>
          <p>Track your applications</p>
        </div>
        <div className="dashboard-card">
          <h3>💬 My Queries</h3>
          <p>View and raise queries</p>
        </div>
        <div className="dashboard-card">
          <h3>⭐ Feedback</h3>
          <p>Rate colleges and counsellors</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;