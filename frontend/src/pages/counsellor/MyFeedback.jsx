import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { feedbackApi } from '../../api/feedbackApi';

const MyFeedback = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      // Use the new endpoint that doesn't require passing user ID
      const response = await feedbackApi.getMyReceivedFeedbacks();
      setFeedbacks(response.data);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const total = feedbacks.reduce((sum, fb) => sum + fb.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  };

  if (loading) return <div className="loading">Loading feedbacks...</div>;

  return (
    <div className="my-feedback-page">
      <h1>📝 My Feedback</h1>
      <p className="subtitle">View feedback received from students</p>

      {error && <div className="error-message">{error}</div>}

      {/* Summary Stats */}
      <div className="feedback-summary">
        <div className="summary-card">
          <h3>Total Feedback</h3>
          <span className="stat-number">{feedbacks.length}</span>
        </div>
        <div className="summary-card">
          <h3>Average Rating</h3>
          <span className="stat-number">{calculateAverageRating()} ⭐</span>
        </div>
      </div>

      {feedbacks.length === 0 ? (
        <div className="empty-state">
          <p>No feedback received yet.</p>
          <p>When students provide feedback about your counselling services, it will appear here.</p>
        </div>
      ) : (
        <div className="feedback-list">
          {feedbacks.map((feedback) => (
            <div key={feedback.id} className="feedback-card">
              <div className="feedback-header">
                <div className="student-info">
                  <span className="student-name">👤 {feedback.studentName}</span>
                  <span className="feedback-date">
                    {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="rating">
                  {renderStars(feedback.rating)}
                </div>
              </div>
              <div className="feedback-comment">
                <p>"{feedback.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .my-feedback-page {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .my-feedback-page h1 {
          color: #333;
          margin-bottom: 5px;
        }

        .subtitle {
          color: #666;
          margin-bottom: 30px;
        }

        .feedback-summary {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px 30px;
          border-radius: 12px;
          text-align: center;
          flex: 1;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .summary-card h3 {
          margin: 0 0 10px 0;
          font-size: 14px;
          opacity: 0.9;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-number {
          font-size: 32px;
          font-weight: bold;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f8f9fa;
          border-radius: 12px;
          color: #666;
        }

        .empty-state p:first-child {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .feedback-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .feedback-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid #eee;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .feedback-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .feedback-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .student-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .student-name {
          font-weight: 600;
          color: #333;
          font-size: 16px;
        }

        .feedback-date {
          color: #888;
          font-size: 13px;
        }

        .rating {
          font-size: 18px;
          letter-spacing: 2px;
        }

        .feedback-comment {
          background: #f8f9fa;
          padding: 16px 20px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .feedback-comment p {
          margin: 0;
          color: #555;
          font-style: italic;
          line-height: 1.6;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .error-message {
          background: #fee;
          color: #c00;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        @media (max-width: 600px) {
          .feedback-summary {
            flex-direction: column;
          }

          .feedback-header {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default MyFeedback;