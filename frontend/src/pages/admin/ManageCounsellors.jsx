import { useState, useEffect } from 'react';
import { collegeApi, counsellorAssignmentApi } from '../../api/collegeApi';

const ManageCounsellors = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [counsellorsRes, collegesRes] = await Promise.all([
        counsellorAssignmentApi.getAllCounsellorsWithAssignments(),
        collegeApi.getMyColleges(),
      ]);
      setCounsellors(counsellorsRes.data);
      setColleges(collegesRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedCounsellor || !selectedCollegeId) {
      setError('Please select a college');
      return;
    }
    try {
      setError('');
      await counsellorAssignmentApi.assignCounsellor(selectedCounsellor.id, parseInt(selectedCollegeId));
      setSuccess('Counsellor assigned successfully!');
      setShowAssignModal(false);
      setSelectedCollegeId('');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign');
    }
  };

  const handleUnassign = async (counsellorId, collegeId, collegeName) => {
    if (!window.confirm(`Remove this counsellor from ${collegeName}?`)) return;
    try {
      await counsellorAssignmentApi.unassignCounsellor(counsellorId, collegeId);
      setSuccess('Counsellor unassigned successfully');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to unassign');
    }
  };

  const openAssignModal = (counsellor) => {
    setSelectedCounsellor(counsellor);
    setSelectedCollegeId('');
    setError('');
    setShowAssignModal(true);
  };

  // Filter colleges that aren't already assigned
  const getAvailableColleges = () => {
    if (!selectedCounsellor) return colleges;
    const assignedIds = selectedCounsellor.assignedColleges.map(c => c.collegeId);
    return colleges.filter(c => !assignedIds.includes(c.id));
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="manage-counsellors">
      <h1>👨‍💼 Manage Counsellor Assignments</h1>
      <p className="subtitle">Assign counsellors to colleges. Maximum {counsellors[0]?.maxAllowed || 3} colleges per counsellor.</p>

      {success && <div className="success-msg">{success}</div>}
      {error && !showAssignModal && <div className="error-msg">{error}</div>}

      {counsellors.length === 0 ? (
        <div className="no-results">
          <p>No counsellors registered yet.</p>
        </div>
      ) : (
        <div className="counsellor-list">
          {counsellors.map((c) => (
            <div key={c.id} className="counsellor-card">
              <div className="counsellor-header">
                <div>
                  <h3>👤 {c.name}</h3>
                  <p className="email">📧 {c.email}</p>
                </div>
                <div className="assignment-info">
                  <span className="badge">{c.totalAssignments} / {c.maxAllowed} colleges</span>
                  <button
                    onClick={() => openAssignModal(c)}
                    className="btn-primary"
                    disabled={c.totalAssignments >= c.maxAllowed}
                  >
                    {c.totalAssignments >= c.maxAllowed ? '✓ Max Reached' : '+ Assign College'}
                  </button>
                </div>
              </div>

              <div className="assigned-colleges">
                <h4>Assigned Colleges:</h4>
                {c.assignedColleges.length === 0 ? (
                  <p className="empty">No colleges assigned yet</p>
                ) : (
                  <div className="college-tags">
                    {c.assignedColleges.map((col) => (
                      <span key={col.assignmentId} className="college-tag">
                        🏫 {col.collegeName}
                        <button
                          onClick={() => handleUnassign(c.id, col.collegeId, col.collegeName)}
                          className="remove-btn"
                          title="Unassign"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign College to {selectedCounsellor?.name}</h2>
              <button onClick={() => setShowAssignModal(false)} className="close-btn">✕</button>
            </div>
            <div className="modal-body">
              {error && <div className="error-msg">{error}</div>}
              <div className="form-group">
                <label>Select a College</label>
                <select
                  value={selectedCollegeId}
                  onChange={(e) => setSelectedCollegeId(e.target.value)}
                >
                  <option value="">-- Select College --</option>
                  {getAvailableColleges().map((col) => (
                    <option key={col.id} value={col.id}>{col.name} - {col.city}</option>
                  ))}
                </select>
                {getAvailableColleges().length === 0 && (
                  <p className="info-text">All your colleges are already assigned to this counsellor.</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowAssignModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleAssign} className="btn-primary" disabled={!selectedCollegeId}>
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .manage-counsellors {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px;
        }
        .subtitle {
          color: #666;
          margin-bottom: 20px;
        }
        .counsellor-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .counsellor-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          border: 1px solid #eee;
        }
        .counsellor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .counsellor-header h3 {
          margin: 0 0 4px 0;
        }
        .email {
          color: #666;
          font-size: 14px;
          margin: 0;
        }
        .assignment-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }
        .assigned-colleges {
          background: #f8f9fa;
          padding: 16px;
          border-radius: 8px;
        }
        .assigned-colleges h4 {
          margin: 0 0 10px 0;
          color: #555;
          font-size: 14px;
        }
        .empty {
          color: #888;
          font-style: italic;
          margin: 0;
        }
        .college-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .college-tag {
          background: white;
          border: 1px solid #ddd;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .remove-btn {
          background: #fee;
          color: #c00;
          border: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .remove-btn:hover {
          background: #fcc;
        }
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 500px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h2 {
          margin: 0;
          font-size: 18px;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #999;
        }
        .modal-body {
          padding: 20px;
        }
        .modal-footer {
          padding: 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .info-text {
          color: #888;
          font-size: 13px;
          margin-top: 8px;
        }
        .success-msg {
          background: #d4edda;
          color: #155724;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        .error-msg {
          background: #f8d7da;
          color: #721c24;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default ManageCounsellors;