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
import RaiseQuery from './pages/student/RaiseQuery';
import MyQueries from './pages/student/MyQueries';
import GiveFeedback from './pages/student/GiveFeedback';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageColleges from './pages/admin/ManageColleges';
import ViewApplications from './pages/admin/ViewApplications';
import CounsellorDashboard from './pages/counsellor/CounsellorDashboard';
import ViewQueries from './pages/counsellor/ViewQueries';
import BrowseColleges from './pages/BrowseColleges';
import CollegeDetailPage from './pages/CollegeDetailPage';
import ReportsPage from './pages/ReportsPage';
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
              <Route path="/colleges" element={<BrowseColleges />} />
              <Route path="/colleges/:id" element={<CollegeDetailPage />} />

              {/* Student Routes */}
              <Route path="/student/dashboard" element={<ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
              <Route path="/student/apply/:collegeId" element={<ProtectedRoute roles={['STUDENT']}><ApplyPage /></ProtectedRoute>} />
              <Route path="/student/applications" element={<ProtectedRoute roles={['STUDENT']}><MyApplications /></ProtectedRoute>} />
              <Route path="/student/raise-query" element={<ProtectedRoute roles={['STUDENT']}><RaiseQuery /></ProtectedRoute>} />
              <Route path="/student/queries" element={<ProtectedRoute roles={['STUDENT']}><MyQueries /></ProtectedRoute>} />
              <Route path="/student/feedback" element={<ProtectedRoute roles={['STUDENT']}><GiveFeedback /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/colleges" element={<ProtectedRoute roles={['ADMIN']}><ManageColleges /></ProtectedRoute>} />
              <Route path="/admin/applications" element={<ProtectedRoute roles={['ADMIN']}><ViewApplications /></ProtectedRoute>} />

              {/* Counsellor Routes */}
              <Route path="/counsellor/dashboard" element={<ProtectedRoute roles={['COUNSELLOR']}><CounsellorDashboard /></ProtectedRoute>} />
              <Route path="/counsellor/queries" element={<ProtectedRoute roles={['COUNSELLOR']}><ViewQueries /></ProtectedRoute>} />

              {/* Reports (accessible to all authenticated users) */}
              <Route path="/reports" element={<ProtectedRoute roles={['STUDENT', 'ADMIN', 'COUNSELLOR']}><ReportsPage /></ProtectedRoute>} />

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