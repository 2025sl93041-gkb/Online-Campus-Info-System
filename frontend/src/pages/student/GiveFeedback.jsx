import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackApi } from '../../api/feedbackApi';
import { collegeApi } from '../../api/collegeApi';

const GiveFeedback = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState({
    type: 'COLLEGE',
    collegeId: '',
    counsellorId: '',
    rating: 5,
    comment: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    collegeApi.getAllColleges().then(res => setColleges(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const payload = {
        type: formData.type,
        rating: parseInt(formData.rating),
        comment: formData.comment,
        collegeId: formData.type === 'COLLEGE' && formData.collegeId ? parseInt(formData.collegeId) : null,
        counsellorId: formData.type === 'COUNSELLOR' && formData.counsellorId ? parseInt(formData.counsellorId) : null,
      };
      await feedbackApi.submitFeedback(payload);
      setSuccess('Feedback submitted successfully!');
      setFormData({ type: 'COLLEGE', collegeId: '', counsellorId: '', rating: 5, comment: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="give-feedback">
      <h1>Give Feedback</h1>

      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Feedback Type *</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="COLLEGE">College Feedback</option>
              <option value="COUNSELLOR">Counsellor Feedback</option>
            </select>
          </div>

          {formData.type === 'COLLEGE' && (
            <div className="form-group">
              <label>Select College *</label>
              <select name="collegeId" value={formData.collegeId} onChange={handleChange} required>
                <option value="">-- Select College --</option>
                {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}

          {formData.type === 'COUNSELLOR' && (
            <div className="form-group">
              <label>Counsellor ID</label>
              <input type="number" name="counsellorId" value={formData.counsellorId} onChange={handleChange} placeholder="Enter counsellor ID" required />
            </div>
          )}

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
            <textarea name="comment" value={formData.comment} onChange={handleChange} rows="4" placeholder="Share your experience..." />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GiveFeedback;