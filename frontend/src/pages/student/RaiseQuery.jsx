import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryApi } from '../../api/queryApi';
import { collegeApi } from '../../api/collegeApi';

const RaiseQuery = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState({ collegeId: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    collegeApi.getAllColleges().then(res => setColleges(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...formData, collegeId: formData.collegeId ? parseInt(formData.collegeId) : null };
      await queryApi.raiseQuery(payload);
      navigate('/student/queries');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit query');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="raise-query">
      <h1>Raise a Query</h1>
      {error && <div className="error-msg">{error}</div>}
      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Related College (optional)</label>
            <select name="collegeId" value={formData.collegeId} onChange={handleChange}>
              <option value="">-- None --</option>
              {colleges.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Subject *</label>
            <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Brief subject of your query" />
          </div>
          <div className="form-group">
            <label>Your Query *</label>
            <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="Describe your query in detail..." />
          </div>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Query'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RaiseQuery;