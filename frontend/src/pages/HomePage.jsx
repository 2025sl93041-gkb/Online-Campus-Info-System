import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>🎓 Online Campus Info System</h1>
        <p>Find your dream college and start your journey</p>
        <div className="hero-actions">
          <Link to="/colleges" className="btn-primary">Browse Colleges</Link>
          <Link to="/register" className="btn-secondary">Get Started</Link>
        </div>
      </div>

      <div className="features-section">
        <h2>What We Offer</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>📚 College Information</h3>
            <p>Browse detailed info about colleges, courses, facilities, and eligibility criteria.</p>
          </div>
          <div className="feature-card">
            <h3>📝 Easy Applications</h3>
            <p>Apply to your dream college directly through our platform.</p>
          </div>
          <div className="feature-card">
            <h3>💬 Counselling Support</h3>
            <p>Get your queries resolved by expert counsellors.</p>
          </div>
          <div className="feature-card">
            <h3>⭐ Feedback & Reports</h3>
            <p>Compare colleges based on student feedback and ratings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;