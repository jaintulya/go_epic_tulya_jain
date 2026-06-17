import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const titles = {
  '/dashboard': 'Overview',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/search': 'Search',
  '/dashboard/problems': 'Problems',
  '/dashboard/solutions': 'Solutions',
  '/dashboard/topics': 'Topics',
  '/dashboard/datasets': 'Datasets',
  '/dashboard/admin/users': 'User Management',
  '/dashboard/admin/server': 'Server Status',
  '/dashboard/profile': 'My Profile',
};

export default function DashboardLayout() {
  const location = useLocation();
  // Pick the title; for detail pages like /dashboard/problems/:id we fall back
  const title = titles[location.pathname] || (location.pathname.startsWith('/dashboard/problems/') ? 'Problem Detail' : 'Dashboard');

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
