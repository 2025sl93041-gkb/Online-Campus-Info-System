import { useState, useEffect } from 'react';
import { collegeApi } from '../../api/collegeApi';
import { applicationApi } from '../../api/applicationApi';

const ViewApplications = () => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      const response = await collegeApi.getMyColleges();
      setColleges(response.data);
      if (response.data.length > 0) {
        setSelectedCollege(response.data[0].id);
        loadApplications(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load colleges:', error);
    }
  };

  const loadApplications = async (collegeId) => {
    setLoading(true);
    try {
      const response = await applicationApi.getApplicationsByCollege(collegeId);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to load applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollegeChange = (e) => {
    const id = e.target.value;
    setSelectedCollege(id);
    loadApplications(id);
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await applicationApi.updateStatus(appId, status);
      loadApplications(selectedCollege);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
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

  return (
    <div className="view-applications">
      <h1>View Applications</h1>

      <div className="filter-bar">
        <div className="form-group">
          <label>Select College</label>
          <select value={selectedCollege} onChange={handleCollegeChange}>
            {colleges.map(college => (
              <option key={college.id} value={college.id}>{college.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading applications...</div>
      ) : applications.length === 0 ? (
        <div className="no-results">
          <p>No applications received yet for this college.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <h3>{app.studentName}</h3>
                <span className={`status-badge ${getStatusClass(app.status)}`}>
                  {app.status}
                </span>
              </div>
              <p><strong>Course:</strong> {app.courseName}</p>
              <p><strong>Email:</strong> {app.studentEmail}</p>
              {app.studentPhone && <p><strong>Phone:</strong> {app.studentPhone}</p>}
              {app.qualification && <p><strong>Qualification:</strong> {app.qualification}</p>}
              {app.percentage && <p><strong>Percentage:</strong> {app.percentage}%</p>}
              {app.statementOfPurpose && <p><strong>SOP:</strong> {app.statementOfPurpose}</p>}
              <p><strong>Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>

              {app.status === 'PENDING' && (
                <div className="application-actions">
                  <button onClick={() => handleStatusUpdate(app.id, 'UNDER_REVIEW')} className="btn-edit">
                    Mark Under Review
                  </button>
                  <button onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')} className="btn-accept">
                    Accept
                  </button>
                  <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="btn-delete">
                    Reject
                  </button>
                </div>
              )}
              {app.status === 'UNDER_REVIEW' && (
                <div className="application-actions">
                  <button onClick={() => handleStatusUpdate(app.id, 'ACCEPTED')} className="btn-accept">
                    Accept
                  </button>
                  <button onClick={() => handleStatusUpdate(app.id, 'REJECTED')} className="btn-delete">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewApplications;