import { useState, useEffect } from 'react';
import { feedbackApi } from '../../api/feedbackApi';
import { collegeApi } from '../../api/collegeApi';

const GiveFeedback = () => {
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState({
    collegeId: '',
    rating: 5,
    comment: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    collegeApi.getAllColleges().then(res => setColleges(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await feedbackApi.submitFeedback({
        type: 'COLLEGE',
        rating: parseInt(formData.rating),
        comment: formData.comment,
        collegeId: formData.collegeId ? parseInt(formData.collegeId) : null,
        counsellorId: null,
      });
      setSuccess('Feedback submitted successfully!');
      setFormData({ collegeId: '', rating: 5, comment: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="give-feedback">
      <h1>Give College Feedback</h1>
      <p style={{color:'#666', marginBottom:'16px'}}>To rate a counsellor, go to "My Queries" and click "⭐ Rate Counsellor" on resolved queries.</p>

      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select College *</label>
            <select name="collegeId" value={formData.collegeId} onChange={(e) => setFormData({...formData, collegeId: e.target.value})} required>
              <option value="">-- Select College --</option>
              {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Rating * (1-5)</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(star => (
                <span
                  key={star}
                  className={`star ${parseInt(formData.rating) >= star ? 'star-active' : ''}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                >
                  ⭐
                </span>
              ))}
              <span className="rating-value">{formData.rating}/5</span>
            </div>
          </div>

          <div className="form-group">
            <label>Comments</label>
            <textarea name="comment" value={formData.comment} onChange={(e) => setFormData({...formData, comment: e.target.value})} rows="4" placeholder="Share your experience about this college..." />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit College Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GiveFeedback;