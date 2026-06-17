import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Suspense } from 'react';
import { ThemeProvider } from './store/ThemeContext';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard Pages
import DashboardLayout from './components/Layout/DashboardLayout';
import Overview from './pages/Dashboard/Overview';
import Analytics from './pages/Dashboard/Analytics';
import Problems from './pages/Dashboard/Problems';
import ProblemDetail from './pages/Dashboard/ProblemDetail';
import Solutions from './pages/Dashboard/Solutions';
import Topics from './pages/Dashboard/Topics';
import Datasets from './pages/Dashboard/Datasets';
import AdminUsers from './pages/Dashboard/AdminUsers';
import ServerStatus from './pages/Dashboard/ServerStatus';
import Profile from './pages/Dashboard/Profile';
import Search from './pages/Dashboard/Search';

// Route guard - requires admin role
function AdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
}

// Route guard - redirect if already logged in
function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((s) => s.auth);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

const LoadingFallback = () => (
  <div className="loading-center" style={{ minHeight: '100vh' }}>
    <div className="spinner"></div>
    <span className="loading-text">Loading...</span>
  </div>
);

// Protected dashboard layout wrapper
function ProtectedDashboard() {
  const { isAuthenticated } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<ProtectedDashboard />}>
              <Route index element={<Overview />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="search" element={<Search />} />
              <Route path="problems" element={<Problems />} />
              <Route path="problems/:id" element={<ProblemDetail />} />
              <Route path="solutions" element={<Solutions />} />
              <Route path="topics" element={<Topics />} />
              <Route path="datasets" element={<Datasets />} />
              <Route path="profile" element={<Profile />} />

              {/* Admin-only routes */}
              <Route path="admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
              <Route path="admin/server" element={<AdminRoute><ServerStatus /></AdminRoute>} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
