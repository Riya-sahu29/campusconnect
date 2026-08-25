import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout, selectCurrentUser } from '../store/authSlice.js';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? '#7C3AED' : '#6b7280',
    fontWeight: isActive(path) ? '600' : '500',
    borderBottom: isActive(path) ? '2px solid #EC4899' : '2px solid transparent',
    paddingBottom: '2px',
    transition: 'all 0.2s',
    textDecoration: 'none',
    fontSize: '14px',
  });

  // Links based on role
  const studentLinks = [
    { to: '/jobs', label: 'Browse Jobs' },
    { to: '/my-applications', label: 'My Applications' },
    { to: '/profile', label: 'Profile' },
  ];

  const recruiterLinks = [
    { to: '/recruiter', label: 'Dashboard' },
    { to: '/recruiter/post-job', label: 'Post a Job' },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Admin Panel' },
  ];

  const links =
    user?.role === 'student' ? studentLinks :
    user?.role === 'recruiter' ? recruiterLinks :
    adminLinks;

  return (
    <nav
      className="bg-white sticky top-0 z-50"
      style={{ boxShadow: '0 2px 12px rgba(124,58,237,0.08)', borderBottom: '1px solid #f3f4f6' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-bold text-gray-900" style={{ fontSize: '16px' }}>
              Campus<span style={{ color: '#7C3AED' }}>Connect</span>
            </span>
          </Link>

          {/* Nav links — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-6">
            {links.map((link) => (
              <Link key={link.to} to={link.to} style={linkStyle(link.to)}
                onMouseEnter={e => { if (!isActive(link.to)) e.target.style.color = '#7C3AED'; }}
                onMouseLeave={e => { if (!isActive(link.to)) e.target.style.color = '#6b7280'; }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side — user info + logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-xs capitalize" style={{ color: '#7C3AED' }}>{user?.role}</p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
            >
              {user?.fullName?.[0]?.toUpperCase() || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-200"
              style={{ color: '#7C3AED', border: '1.5px solid #7C3AED' }}
              onMouseEnter={e => {
                e.target.style.background = 'linear-gradient(135deg, #7C3AED, #EC4899)';
                e.target.style.color = 'white';
                e.target.style.border = '1.5px solid transparent';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#7C3AED';
                e.target.style.border = '1.5px solid #7C3AED';
              }}
            >
              Logout
            </button>
          </div>

        </div>

        {/* Mobile links */}
        <div className="sm:hidden flex gap-4 pb-3 overflow-x-auto">
          {links.map((link) => (
            <Link key={link.to} to={link.to} style={linkStyle(link.to)}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}