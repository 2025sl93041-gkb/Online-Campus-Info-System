import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { queryApi } from '../../api/queryApi';

const MyQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadQueries(); }, []);

  const loadQueries = async () => {
    try {
      const response = await queryApi.getMyQueries();
      setQueries(response.data);
    } catch (error) {
      console.error('Failed to load queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (id) => {
    try {
      await queryApi.closeQuery(id);
      loadQueries();
    } catch (error) {
      alert('Failed to close query');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'RESOLVED': return 'status-accepted';
      case 'CLOSED': return 'status-rejected';
      case 'IN_PROGRESS': return 'status-review';
      default: return 'status-pending';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-queries">
      <div className="page-header">
        <h1>My Queries</h1>
        <Link to="/student/raise-query" className="btn-primary">+ Raise New Query</Link>
      </div>

      {queries.length === 0 ? (
        <div className="no-results"><p>No queries yet. Raise one to get counselling support.</p></div>
      ) : (
        <div className="queries-list">
          {queries.map((q) => (
            <div key={q.id} className="query-card">
              <div className="query-header">
                <h3>{q.subject}</h3>
                <span className={`status-badge ${getStatusClass(q.status)}`}>{q.status}</span>
              </div>
              <p className="query-message">{q.message}</p>
              {q.collegeName && <p><strong>College:</strong> {q.collegeName}</p>}
              {q.counsellorName && <p><strong>Counsellor:</strong> {q.counsellorName}</p>}
              <p className="query-date">Asked on: {new Date(q.createdAt).toLocaleDateString()}</p>

              {q.response && (
                <div className="query-response">
                  <strong>Response:</strong>
                  <p>{q.response}</p>
                  <small>Responded on: {new Date(q.respondedAt).toLocaleDateString()}</small>
                </div>
              )}

              {q.status === 'RESOLVED' && (
                <button onClick={() => handleClose(q.id)} className="btn-secondary">Close Query</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyQueries;