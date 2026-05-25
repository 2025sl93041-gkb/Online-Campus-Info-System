import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN': return '/admin/dashboard';
      case 'COUNSELLOR': return '/counsellor/dashboard';
      case 'STUDENT': return '/student/dashboard';
      default: return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">🎓 Online Campus Info</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/colleges">Colleges</Link>
        {isAuthenticated() ? (
          <>
            <Link to={getDashboardLink()}>Dashboard</Link>
            <span className="navbar-user">
              Hi, {user?.name} ({user?.role})
            </span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;