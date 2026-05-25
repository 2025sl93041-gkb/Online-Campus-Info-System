import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ApplyPage from './pages/student/ApplyPage';
import MyApplications from './pages/student/MyApplications';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageColleges from './pages/admin/ManageColleges';
import ViewApplications from './pages/admin/ViewApplications';
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

              {/* College Routes (Public) */}
              <Route path="/colleges" element={<BrowseColleges />} />
              <Route path="/colleges/:id" element={<CollegeDetailPage />} />

              {/* Student Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute roles={['STUDENT']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/apply/:collegeId"
                element={
                  <ProtectedRoute roles={['STUDENT']}>
                    <ApplyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/applications"
                element={
                  <ProtectedRoute roles={['STUDENT']}>
                    <MyApplications />
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
              <Route
                path="/admin/colleges"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <ManageColleges />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <ProtectedRoute roles={['ADMIN']}>
                    <ViewApplications />
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