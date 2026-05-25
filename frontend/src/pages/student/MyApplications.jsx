import { useState, useEffect } from 'react';
import { applicationApi } from '../../api/applicationApi';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const response = await applicationApi.getMyApplications();
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'status-accepted';
      case 'REJECTED': return 'status-rejected';
      case 'UNDER_REVIEW': return 'status-review';
      default: return 'status-pending';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-applications">
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <div className="no-results">
          <p>You haven't submitted any applications yet.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <h3>{app.collegeName}</h3>
                <span className={`status-badge ${getStatusClass(app.status)}`}>
                  {app.status}
                </span>
              </div>
              <p><strong>Course:</strong> {app.courseName}</p>
              <p><strong>Applied on:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
              {app.qualification && <p><strong>Qualification:</strong> {app.qualification}</p>}
              {app.percentage && <p><strong>Percentage:</strong> {app.percentage}%</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;