import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from './store/authSlice.js';

import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import JobDetailPage from './pages/JobDetailPage.jsx';
import StudentProfilePage from './pages/StudentProfilePage.jsx';
import MyApplicationsPage from './pages/MyApplicationsPage.jsx';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage.jsx';
import PostJobPage from './pages/PostJobPage.jsx';
import ApplicantsPage from './pages/ApplicantsPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

export default function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        {isAuthenticated && <Navbar />}
        <main>
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />} />
            <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" replace />} />
            <Route
              path="/"
              element={
                !isAuthenticated ? <Navigate to="/login" replace /> :
                user?.role === 'admin' ? <Navigate to="/admin" replace /> :
                user?.role === 'recruiter' ? <Navigate to="/recruiter" replace /> :
                <Navigate to="/jobs" replace />
              }
            />
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
              <Route path="/profile" element={<StudentProfilePage />} />
              <Route path="/my-applications" element={<MyApplicationsPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
              <Route path="/recruiter" element={<RecruiterDashboardPage />} />
              <Route path="/recruiter/post-job" element={<PostJobPage />} />
              <Route path="/recruiter/applicants/:jobId" element={<ApplicantsPage />} />
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}