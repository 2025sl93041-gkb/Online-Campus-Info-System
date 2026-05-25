import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collegeApi } from '../../api/collegeApi';
import { applicationApi } from '../../api/applicationApi';
import { useAuth } from '../../context/AuthContext';

const ApplyPage = () => {
  const { collegeId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [college, setCollege] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    courseId: '',
    studentName: '',
    studentEmail: '',
    studentPhone: '',
    qualification: '',
    percentage: '',
    address: '',
    statementOfPurpose: '',
  });

  useEffect(() => {
    loadCollegeData();
  }, [collegeId]);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        studentName: user.name || '',
        studentEmail: user.email || '',
      }));
    }
  }, [user]);

  const loadCollegeData = async () => {
    try {
      const [collegeRes, coursesRes] = await Promise.all([
        collegeApi.getCollegeById(collegeId),
        collegeApi.getCourses(collegeId),
      ]);
      setCollege(collegeRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      setError('Failed to load college information');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await applicationApi.submitApplication({
        ...formData,
        collegeId: parseInt(collegeId),
        courseId: parseInt(formData.courseId),
        percentage: formData.percentage ? parseFloat(formData.percentage) : null,
      });
      setSuccess('Application submitted successfully!');
      setTimeout(() => navigate('/student/applications'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!college) return <div className="not-found"><h2>College not found</h2></div>;

  return (
    <div className="apply-page">
      <h1>Apply to {college.name}</h1>
      <p className="college-location">📍 {college.city}, {college.state}</p>

      {success && <div className="success-msg">{success}</div>}
      {error && <div className="error-msg">{error}</div>}

      <div className="form-card">
        <h2>Admission Application Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Course *</label>
            <select name="courseId" value={formData.courseId} onChange={handleChange} required>
              <option value="">-- Select a course --</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} {course.duration ? `(${course.duration})` : ''} {course.fee ? `- ₹${course.fee}` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" name="studentEmail" value={formData.studentEmail} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" name="studentPhone" value={formData.studentPhone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Qualification</label>
              <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} placeholder="e.g., 12th Standard" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Percentage/CGPA</label>
              <input type="number" step="0.01" name="percentage" value={formData.percentage} onChange={handleChange} placeholder="e.g., 85.5" />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" />
          </div>

          <div className="form-group">
            <label>Statement of Purpose</label>
            <textarea name="statementOfPurpose" value={formData.statementOfPurpose} onChange={handleChange} rows="4" placeholder="Why do you want to join this college?" />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyPage;