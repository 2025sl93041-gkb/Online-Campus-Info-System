import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collegeApi } from '../api/collegeApi';
import { useAuth } from '../context/AuthContext';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250"><rect width="400" height="250" fill="%23f0f2f5"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="%23999" text-anchor="middle" dy=".3em">No Image Available</text></svg>';

const CollegeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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

  // Build full image URL (handles both /api/files/... and absolute URLs)
  const getImageUrl = (url) => {
    if (!url) return PLACEHOLDER_IMAGE;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    if (url.startsWith('/api/')) return `http://localhost:8080${url}`;
    return url;
  };

  if (loading) return <div className="loading">Loading college details...</div>;
  if (!college) return <div className="not-found"><h2>College not found</h2></div>;

  const hasImages = college.images && college.images.length > 0;

  return (
    <div className="college-detail">
      <div className="college-detail-header">
        <h1>{college.name}</h1>
        <span className="college-rating-large">⭐ {college.averageRating?.toFixed(1) || '0.0'} ({college.totalFeedbacks} reviews)</span>
      </div>

      {/* College Images Gallery */}
      <div className="college-section">
        <h2>📷 Photos {hasImages && `(${college.images.length})`}</h2>
        {hasImages ? (
          <div className="image-gallery">
            <div className="main-image-container">
              <img
                src={getImageUrl(selectedImage?.imageUrl || college.images[0].imageUrl)}
                alt={selectedImage?.caption || college.images[0].caption || college.name}
                className="main-image"
                onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
              />
              {(selectedImage?.caption || college.images[0].caption) && (
                <div className="image-caption">
                  {selectedImage?.caption || college.images[0].caption}
                </div>
              )}
            </div>
            {college.images.length > 1 && (
              <div className="image-thumbnails">
                {college.images.map((img) => (
                  <div
                    key={img.id}
                    className={`thumbnail ${(selectedImage?.id || college.images[0].id) === img.id ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={getImageUrl(img.imageUrl)}
                      alt={img.caption || ''}
                      onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="no-image-placeholder">
            <img src={PLACEHOLDER_IMAGE} alt="No image" />
            <p>No images available for this college yet.</p>
          </div>
        )}
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

      <style>{`
        .image-gallery {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .main-image-container {
          position: relative;
          width: 100%;
          max-height: 500px;
          border-radius: 12px;
          overflow: hidden;
          background: #f0f2f5;
        }
        .main-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
        }
        .image-caption {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.7));
          color: white;
          padding: 16px;
          font-size: 14px;
        }
        .image-thumbnails {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px;
        }
        .thumbnail {
          flex: 0 0 100px;
          height: 80px;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          border: 3px solid transparent;
          transition: all 0.2s;
        }
        .thumbnail.active {
          border-color: #667eea;
        }
        .thumbnail:hover {
          transform: scale(1.05);
        }
        .thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .no-image-placeholder {
          text-align: center;
          padding: 30px;
          background: #f8f9fa;
          border-radius: 12px;
          color: #888;
        }
        .no-image-placeholder img {
          max-width: 300px;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
};

export default CollegeDetailPage;