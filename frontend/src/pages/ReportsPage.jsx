import { useState, useEffect } from 'react';
import { reportApi } from '../api/reportApi';

const ReportsPage = () => {
  const [collegeComparison, setCollegeComparison] = useState([]);
  const [counsellorPerformance, setCounsellorPerformance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const [collegeRes, counsellorRes, statsRes] = await Promise.all([
        reportApi.getCollegeComparison(),
        reportApi.getCounsellorPerformance(),
        reportApi.getApplicationStats(),
      ]);
      setCollegeComparison(collegeRes.data);
      setCounsellorPerformance(counsellorRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="reports-page">
      <h1>Reports & Comparison</h1>

      {/* Overall Stats */}
      {stats && (
        <div className="report-section">
          <h2>📊 Overall Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{stats.totalColleges}</span>
              <span className="stat-label">Colleges</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.totalStudents}</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.totalApplications}</span>
              <span className="stat-label">Applications</span>
            </div>
            <div className="stat-card stat-accepted">
              <span className="stat-number">{stats.accepted}</span>
              <span className="stat-label">Accepted</span>
            </div>
            <div className="stat-card stat-pending">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card stat-rejected">
              <span className="stat-number">{stats.rejected}</span>
              <span className="stat-label">Rejected</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.openQueries}</span>
              <span className="stat-label">Open Queries</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{stats.resolvedQueries}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        </div>
      )}

      {/* College Comparison */}
      <div className="report-section">
        <h2>🏫 College Feedback Comparison</h2>
        {collegeComparison.length === 0 ? (
          <p className="no-results">No college feedback data available yet.</p>
        ) : (
          <div className="comparison-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>College</th>
                  <th>City</th>
                  <th>Avg Rating</th>
                  <th>Feedbacks</th>
                  <th>Applications</th>
                </tr>
              </thead>
              <tbody>
                {collegeComparison.map((college, index) => (
                  <tr key={college.collegeId}>
                    <td>{index + 1}</td>
                    <td><strong>{college.collegeName}</strong></td>
                    <td>{college.city || '-'}</td>
                    <td>
                      <span className="rating-badge">⭐ {college.averageRating}</span>
                    </td>
                    <td>{college.totalFeedbacks}</td>
                    <td>{college.totalApplications}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Simple bar chart */}
            <div className="bar-chart">
              <h3>Rating Comparison</h3>
              {collegeComparison.map((college) => (
                <div key={college.collegeId} className="bar-row">
                  <span className="bar-label">{college.collegeName}</span>
                  <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${(college.averageRating / 5) * 100}%` }}>
                      {college.averageRating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Counsellor Performance */}
      <div className="report-section">
        <h2>👨‍💼 Counsellor Performance</h2>
        {counsellorPerformance.length === 0 ? (
          <p className="no-results">No counsellor data available yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Counsellor</th>
                <th>Avg Rating</th>
                <th>Feedbacks</th>
                <th>Queries Handled</th>
              </tr>
            </thead>
            <tbody>
              {counsellorPerformance.map((c) => (
                <tr key={c.counsellorId}>
                  <td><strong>{c.counsellorName}</strong></td>
                  <td><span className="rating-badge">⭐ {c.averageRating}</span></td>
                  <td>{c.totalFeedbacks}</td>
                  <td>{c.totalQueries}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;