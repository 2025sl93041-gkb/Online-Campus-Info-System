import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collegeApi } from '../api/collegeApi';

const BrowseColleges = () => {
  const [colleges, setColleges] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadColleges();
  }, []);

  const loadColleges = async () => {
    try {
      const response = await collegeApi.getAllColleges();
      setColleges(response.data);
    } catch (error) {
      console.error('Failed to load colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadColleges();
      return;
    }
    setLoading(true);
    try {
      const response = await collegeApi.searchColleges(searchQuery);
      setColleges(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading colleges...</div>;

  return (
    <div className="browse-colleges">
      <h1>Browse Colleges</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by name, city, or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {colleges.length === 0 ? (
        <div className="no-results">
          <p>No colleges found. {searchQuery && 'Try a different search term.'}</p>
        </div>
      ) : (
        <div className="college-list">
          {colleges.map((college) => (
            <div key={college.id} className="college-card">
              <div className="college-card-header">
                <h3>{college.name}</h3>
                <span className="college-rating">⭐ {college.averageRating?.toFixed(1) || '0.0'}</span>
              </div>
              <p className="college-location">📍 {college.city}, {college.state}</p>
              {college.description && (
                <p className="college-desc">{college.description.substring(0, 150)}...</p>
              )}
              <div className="college-meta">
                {college.establishedYear && <span>Est. {college.establishedYear}</span>}
                {college.strength && <span>👥 {college.strength} students</span>}
                <span>📝 {college.totalFeedbacks || 0} reviews</span>
              </div>
              <Link to={`/colleges/${college.id}`} className="btn-primary">View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseColleges;