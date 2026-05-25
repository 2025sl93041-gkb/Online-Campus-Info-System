import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageColleges from './pages/admin/ManageColleges';
import CounsellorDashboard from './pages/counsellor/CounsellorDashboard';
import BrowseColleges from './pages/BrowseColleges';
import CollegeDetailPage from './pages/CollegeDetailPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute roles={['STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin - Manage Colleges */}
              <Route
                path="/admin/colleges"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <ManageColleges />
                  </ProtectedRoute>
                }
              />

              {/* Counsellor Routes */}
              <Route
                path="/counsellor/dashboard"
                element={
                  <ProtectedRoute roles={['COUNSELLOR']}>
                    <CounsellorDashboard />
                  </ProtectedRoute>
                }
              />

              {/* College Routes (Public) */}
              <Route path="/colleges" element={<BrowseColleges />} />
              <Route path="/colleges/:id" element={<CollegeDetailPage />} />

              {/* Fallback */}
              <Route path="*" element={<div className="not-found"><h2>404 - Page Not Found</h2></div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;