import { useState, useEffect } from 'react';
import { collegeApi } from '../../api/collegeApi';
import { applicationApi } from '../../api/applicationApi';

const ViewApplications = () => {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(''); // '' means show all
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadColleges();
    loadApplications(''); // Load all applications by default
  }, []);

  const loadColleges = async () => {
    try {
      const response = await collegeApi.getMyColleges();
      setColleges(response.data);
    } catch (error) {
      console.error('Failed to load colleges:', error);
    }
  };

  const loadApplications = async (collegeId) => {
    setLoading(true);
    try {
      const response = await applicationApi.getAllForAdmin(collegeId || null);
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to load applications:', error);
      setApplications([]);
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

  // Filter by status (client-side)
  const filteredApplications = statusFilter === 'ALL'
    ? applications
    : applications.filter(a => a.status === statusFilter);

  return (
    <div className="view-applications">
      <h1>📋 View Applications</h1>
      <p className="subtitle">All applications across your colleges</p>

      <div className="filter-bar" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Filter by College</label>
          <select value={selectedCollege} onChange={handleCollegeChange}>
            <option value="">🏫 All Colleges ({applications.length})</option>
            {colleges.map(college => (
              <option key={college.id} value={college.id}>{college.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
          <label>Filter by Status</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats summary */}
      {applications.length > 0 && (
        <div className="stats-summary" style={{ display: 'flex', gap: '12px', margin: '20px 0', flexWrap: 'wrap' }}>
          <div className="stat-pill">Total: <strong>{applications.length}</strong></div>
          <div className="stat-pill">Pending: <strong>{applications.filter(a => a.status === 'PENDING').length}</strong></div>
          <div className="stat-pill">Under Review: <strong>{applications.filter(a => a.status === 'UNDER_REVIEW').length}</strong></div>
          <div className="stat-pill">Accepted: <strong>{applications.filter(a => a.status === 'ACCEPTED').length}</strong></div>
          <div className="stat-pill">Rejected: <strong>{applications.filter(a => a.status === 'REJECTED').length}</strong></div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading applications...</div>
      ) : filteredApplications.length === 0 ? (
        <div className="no-results">
          <p>No applications found {selectedCollege && 'for the selected college'}{statusFilter !== 'ALL' && ` with status: ${statusFilter}`}.</p>
        </div>
      ) : (
        <div className="applications-list">
          {filteredApplications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <h3>{app.studentName}</h3>
                <span className={`status-badge ${getStatusClass(app.status)}`}>
                  {app.status}
                </span>
              </div>
              <p><strong>🏫 College:</strong> {app.collegeName}</p>
              <p><strong>📚 Course:</strong> {app.courseName}</p>
              <p><strong>📧 Email:</strong> {app.studentEmail}</p>
              {app.studentPhone && <p><strong>📞 Phone:</strong> {app.studentPhone}</p>}
              {app.qualification && <p><strong>🎓 Qualification:</strong> {app.qualification}</p>}
              {app.percentage && <p><strong>📊 Percentage:</strong> {app.percentage}%</p>}
              {app.statementOfPurpose && <p><strong>📝 SOP:</strong> {app.statementOfPurpose}</p>}
              <p><strong>📅 Applied:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>

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

      <style>{`
        .stat-pill {
          padding: 8px 16px;
          background: #f0f2f5;
          border-radius: 20px;
          font-size: 14px;
          color: #555;
        }
        .stat-pill strong {
          color: #667eea;
        }
        .subtitle {
          color: #666;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
};

export default ViewApplications;