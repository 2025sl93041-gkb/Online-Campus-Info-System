import { useState, useEffect } from 'react';
import { reportApi } from '../api/reportApi';
import { useAuth } from '../context/AuthContext';

const ReportsPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ comparison: [], feedbacks: [], counsellors: [], myPerf: null, stats: null });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('comparison');
  const isAdmin = user?.role === 'ADMIN';
  const isCounsellor = user?.role === 'COUNSELLOR';

  useEffect(() => {
    const load = async () => {
      try {
        const [c1, c2] = await Promise.all([
          reportApi.getCollegeComparison().catch(() => ({ data: [] })),
          reportApi.getCollegeFeedbacksDetailed().catch(() => ({ data: [] })),
        ]);
        const newData = { comparison: c1.data, feedbacks: c2.data, counsellors: [], myPerf: null, stats: null };

        if (isAdmin) {
          const [p, s] = await Promise.all([
            reportApi.getCounsellorPerformance().catch(() => ({ data: [] })),
            reportApi.getApplicationStats().catch(() => ({ data: null })),
          ]);
          newData.counsellors = p.data;
          newData.stats = s.data;
        }

        const counsellorId = user?.userId || user?.id;
        if (isCounsellor && counsellorId) {
          try {
            const m = await reportApi.getMyPerformance(counsellorId);
            newData.myPerf = m.data;
          } catch (e) {
            console.error('Failed to load my performance:', e);
          }
        }

        setData(newData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stars = (r) => '⭐'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r));

  const renderFB = (fb) => (
    <div key={fb.id} style={{ background: '#f8f9fa', padding: 12, borderRadius: 8, borderLeft: '4px solid #667eea', marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
        <strong>{fb.studentName}</strong>
        <span>{stars(fb.rating)}</span>
        <span style={{ color: '#888', fontSize: 13 }}>{new Date(fb.createdAt).toLocaleDateString()}</span>
      </div>
      {fb.comment && <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>"{fb.comment}"</p>}
    </div>
  );

  if (loading) return <div className="loading">Loading reports...</div>;

  const btn = (a) => ({ padding: '10px 16px', border: 'none', background: a ? '#667eea' : '#f0f2f5', color: a ? 'white' : '#333', borderRadius: 8, cursor: 'pointer', fontWeight: a ? 600 : 400 });

  return (
    <div className="reports-page">
      <h1>📊 Reports & Comparison</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>{isAdmin ? 'System-wide reports' : isCounsellor ? 'Your performance & feedback' : 'College ratings & reviews'}</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <button style={btn(tab === 'comparison')} onClick={() => setTab('comparison')}>🏫 College Comparison</button>
        <button style={btn(tab === 'feedbacks')} onClick={() => setTab('feedbacks')}>💬 College Reviews</button>
        {isCounsellor && <button style={btn(tab === 'me')} onClick={() => setTab('me')}>🎯 My Performance</button>}
        {isAdmin && <button style={btn(tab === 'cnsl')} onClick={() => setTab('cnsl')}>👨‍💼 Counsellor Reports</button>}
        {isAdmin && <button style={btn(tab === 'stats')} onClick={() => setTab('stats')}>📈 System Stats</button>}
      </div>

      {tab === 'comparison' && <ComparisonTab data={data.comparison} isAdmin={isAdmin} />}
      {tab === 'feedbacks' && <FeedbacksTab data={data.feedbacks} renderFB={renderFB} />}
      {tab === 'me' && isCounsellor && (data.myPerf
        ? <MyPerfTab data={data.myPerf} renderFB={renderFB} />
        : <div className="report-section"><h2>🎯 My Performance</h2><p className="no-results">Loading your performance data... If this stays empty, you may not have any data yet (no resolved queries or feedback received).</p></div>
      )}
      {tab === 'cnsl' && isAdmin && <CounsellorsTab data={data.counsellors} renderFB={renderFB} />}
      {tab === 'stats' && isAdmin && data.stats && <StatsTab stats={data.stats} />}
    </div>
  );
};

const ComparisonTab = ({ data, isAdmin }) => (
  <div className="report-section">
    <h2>🏫 College Feedback Comparison</h2>
    {data.length === 0 ? <p className="no-results">No data available.</p> : (
      <>
        <table className="data-table">
          <thead><tr><th>#</th><th>College</th><th>City</th><th>Rating</th><th>Feedbacks</th>{isAdmin && <th>Apps</th>}</tr></thead>
          <tbody>
            {data.map((c, i) => (
              <tr key={c.collegeId}>
                <td>{i + 1}</td>
                <td><strong>{c.collegeName}</strong></td>
                <td>{c.city || '-'}</td>
                <td><span className="rating-badge">⭐ {c.averageRating}</span></td>
                <td>{c.totalFeedbacks}</td>
                {isAdmin && <td>{c.totalApplications}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bar-chart" style={{ marginTop: 20 }}>
          <h3>Rating Comparison</h3>
          {data.map((c) => (
            <div key={c.collegeId} className="bar-row">
              <span className="bar-label">{c.collegeName}</span>
              <div className="bar-container"><div className="bar-fill" style={{ width: `${(c.averageRating / 5) * 100}%` }}>{c.averageRating}</div></div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);

const FeedbacksTab = ({ data, renderFB }) => (
  <div className="report-section">
    <h2>💬 College Reviews & Comments</h2>
    {data.every(c => c.totalFeedbacks === 0) ? <p className="no-results">No feedback comments yet.</p> : (
      <div>
        {data.filter(c => c.totalFeedbacks > 0).map((college) => (
          <div key={college.collegeId} style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0 }}>{college.collegeName}</h3>
              <span className="rating-badge">⭐ {college.averageRating} ({college.totalFeedbacks})</span>
            </div>
            {college.feedbacks.map(renderFB)}
          </div>
        ))}
      </div>
    )}
  </div>
);

const MyPerfTab = ({ data, renderFB }) => (
  <div className="report-section">
    <h2>🎯 My Performance</h2>
    <div className="stats-grid">
      <div className="stat-card"><span className="stat-number">{data.averageRating}</span><span className="stat-label">Avg Rating ⭐</span></div>
      <div className="stat-card"><span className="stat-number">{data.totalFeedbacks}</span><span className="stat-label">Total Feedback</span></div>
      <div className="stat-card stat-accepted"><span className="stat-number">{data.resolvedQueries}</span><span className="stat-label">Resolved</span></div>
      <div className="stat-card stat-pending"><span className="stat-number">{data.totalQueries}</span><span className="stat-label">Active Queries</span></div>
    </div>
    <h3 style={{ marginTop: 24 }}>Student Feedback Comments</h3>
    {data.feedbackComments?.length > 0 ? <div>{data.feedbackComments.map(renderFB)}</div> : <p className="no-results">No feedback received yet.</p>}
  </div>
);

const CounsellorsTab = ({ data, renderFB }) => (
  <div className="report-section">
    <h2>👨‍💼 Counsellor Performance</h2>
    {data.length === 0 ? <p className="no-results">No counsellor data.</p> : (
      <div>
        {data.map((c) => (
          <div key={c.counsellorId} style={{ background: 'white', padding: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: 0 }}>{c.counsellorName}</h3>
                <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: 14 }}>{c.counsellorEmail}</p>
              </div>
              <span className="rating-badge">⭐ {c.averageRating}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <span style={{ padding: '6px 12px', background: '#e7f3ff', borderRadius: 16, fontSize: 13 }}><strong>{c.resolvedQueries}</strong> Resolved</span>
              <span style={{ padding: '6px 12px', background: '#fff3cd', borderRadius: 16, fontSize: 13 }}><strong>{c.totalQueries}</strong> Active</span>
              <span style={{ padding: '6px 12px', background: '#d4edda', borderRadius: 16, fontSize: 13 }}><strong>{c.totalFeedbacks}</strong> Feedbacks</span>
            </div>
            {c.feedbackComments?.length > 0 && (
              <details>
                <summary style={{ cursor: 'pointer', color: '#667eea', fontWeight: 600 }}>View Feedback Comments ({c.feedbackComments.length})</summary>
                <div style={{ marginTop: 12 }}>{c.feedbackComments.map(renderFB)}</div>
              </details>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

const StatsTab = ({ stats }) => (
  <div className="report-section">
    <h2>📈 System Statistics</h2>
    <div className="stats-grid">
      <div className="stat-card"><span className="stat-number">{stats.totalColleges}</span><span className="stat-label">Colleges</span></div>
      <div className="stat-card"><span className="stat-number">{stats.totalStudents}</span><span className="stat-label">Students</span></div>
      <div className="stat-card"><span className="stat-number">{stats.totalCounsellors}</span><span className="stat-label">Counsellors</span></div>
      <div className="stat-card"><span className="stat-number">{stats.totalApplications}</span><span className="stat-label">Applications</span></div>
      <div className="stat-card stat-pending"><span className="stat-number">{stats.pending}</span><span className="stat-label">Pending</span></div>
      <div className="stat-card stat-accepted"><span className="stat-number">{stats.accepted}</span><span className="stat-label">Accepted</span></div>
      <div className="stat-card stat-rejected"><span className="stat-number">{stats.rejected}</span><span className="stat-label">Rejected</span></div>
      <div className="stat-card"><span className="stat-number">{stats.openQueries}</span><span className="stat-label">Open Queries</span></div>
      <div className="stat-card stat-accepted"><span className="stat-number">{stats.resolvedQueries}</span><span className="stat-label">Resolved (Historical)</span></div>
    </div>
  </div>
);

export default ReportsPage;
