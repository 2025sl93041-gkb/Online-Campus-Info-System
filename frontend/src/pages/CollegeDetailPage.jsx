import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collegeApi } from '../api/collegeApi';
import { useAuth } from '../context/AuthContext';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollege();
  }, [id]);

  const loadCollege = async () => {
    try {
      const response = await collegeApi.getCollegeById(id);
      setCollege(response.data);
    } catch (error) {
      console.error('Failed to load college:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading college details...</div>;
  if (!college) return <div className="not-found"><h2>College not found</h2></div>;

  return (
    <div className="college-detail">
      <div className="college-detail-header">
        <h1>{college.name}</h1>
        <span className="college-rating-large">⭐ {college.averageRating?.toFixed(1) || '0.0'} ({college.totalFeedbacks} reviews)</span>
      </div>

      <div className="college-info-grid">
        <div className="info-item">📍 <strong>Location:</strong> {college.location}, {college.city}, {college.state}</div>
        {college.establishedYear && <div className="info-item">🏛️ <strong>Established:</strong> {college.establishedYear}</div>}
        {college.strength && <div className="info-item">👥 <strong>Student Strength:</strong> {college.strength}</div>}
        {college.website && <div className="info-item">🌐 <strong>Website:</strong> <a href={college.website} target="_blank" rel="noreferrer">{college.website}</a></div>}
        {college.contactEmail && <div className="info-item">📧 <strong>Email:</strong> {college.contactEmail}</div>}
        {college.contactPhone && <div className="info-item">📞 <strong>Phone:</strong> {college.contactPhone}</div>}
      </div>

      {college.description && (
        <div className="college-section">
          <h2>About</h2>
          <p>{college.description}</p>
        </div>
      )}

      {college.courses && college.courses.length > 0 && (
        <div className="college-section">
          <h2>Courses Available ({college.courses.length})</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Department</th>
                <th>Duration</th>
                <th>Seats</th>
                <th>Fee</th>
                <th>Eligibility</th>
              </tr>
            </thead>
            <tbody>
              {college.courses.map((course) => (
                <tr key={course.id}>
                  <td><strong>{course.name}</strong></td>
                  <td>{course.department || '-'}</td>
                  <td>{course.duration || '-'}</td>
                  <td>{course.totalSeats || '-'}</td>
                  <td>{course.fee ? `₹${course.fee}` : '-'}</td>
                  <td>{course.eligibilityCriteria || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {college.facilities && college.facilities.length > 0 && (
        <div className="college-section">
          <h2>Facilities ({college.facilities.length})</h2>
          <div className="facilities-grid">
            {college.facilities.map((facility) => (
              <div key={facility.id} className="facility-card">
                <h4>{facility.name}</h4>
                <span className="facility-type">{facility.type}</span>
                {facility.description && <p>{facility.description}</p>}
                {facility.capacity && <p><strong>Capacity:</strong> {facility.capacity}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {user?.role === 'STUDENT' && (
        <div className="college-actions">
          <Link to={`/student/apply/${college.id}`} className="btn-primary">Apply to this College</Link>
        </div>
      )}
    </div>
  );
};

export default CollegeDetailPage;