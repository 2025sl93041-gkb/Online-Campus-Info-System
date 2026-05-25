import { useState, useEffect } from 'react';
import { queryApi } from '../../api/queryApi';

const ViewQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => { loadQueries(); }, []);

  const loadQueries = async () => {
    try {
      const response = await queryApi.getAssignedQueries();
      setQueries(response.data);
    } catch (error) {
      console.error('Failed to load queries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id) => {
    if (!responseText.trim()) return alert('Please enter a response');
    try {
      await queryApi.respondToQuery(id, responseText);
      setRespondingTo(null);
      setResponseText('');
      loadQueries();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to respond');
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
    <div className="view-queries">
      <h1>Assigned Queries</h1>

      {queries.length === 0 ? (
        <div className="no-results"><p>No queries assigned to you yet.</p></div>
      ) : (
        <div className="queries-list">
          {queries.map((q) => (
            <div key={q.id} className="query-card">
              <div className="query-header">
                <h3>{q.subject}</h3>
                <span className={`status-badge ${getStatusClass(q.status)}`}>{q.status}</span>
              </div>
              <p><strong>From:</strong> {q.studentName}</p>
              {q.collegeName && <p><strong>College:</strong> {q.collegeName}</p>}
              <p className="query-message">{q.message}</p>
              <p className="query-date">Received: {new Date(q.createdAt).toLocaleDateString()}</p>

              {q.response && (
                <div className="query-response">
                  <strong>Your Response:</strong>
                  <p>{q.response}</p>
                </div>
              )}

              {q.status === 'OPEN' && (
                <>
                  {respondingTo === q.id ? (
                    <div className="respond-form">
                      <div className="form-group">
                        <label>Your Response</label>
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          rows="4"
                          placeholder="Type your response to the student..."
                        />
                      </div>
                      <div className="form-actions">
                        <button onClick={() => handleRespond(q.id)} className="btn-primary">Submit Response</button>
                        <button onClick={() => { setRespondingTo(null); setResponseText(''); }} className="btn-secondary">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setRespondingTo(q.id)} className="btn-primary">Respond</button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewQueries;