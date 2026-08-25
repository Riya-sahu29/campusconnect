import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import Spinner from '../components/Spinner.jsx';

export default function AdminDashboardPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axiosInstance.get('/admin/recruiters/pending');
        setRecruiters(res.data.recruiters);
      } catch (err) {
        setError('Failed to load pending recruiters.');
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleAction = async (userId, action) => {
    setUpdating(userId);
    try {
      await axiosInstance.patch(`/admin/recruiters/${userId}/${action}`);
      setRecruiters((prev) => prev.filter((r) => r.user_id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} recruiter.`);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          {recruiters.length} recruiter{recruiters.length !== 1 ? 's' : ''} pending approval
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {recruiters.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #f3f4f6' }}
        >
          <p className="text-4xl mb-4">✅</p>
          <p className="text-lg font-medium text-gray-700">All caught up!</p>
          <p className="text-sm text-gray-400 mt-1">No pending recruiter approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recruiters.map((recruiter) => (
            <div
              key={recruiter.user_id}
              className="bg-white rounded-2xl p-6 transition-all duration-300"
              style={{ boxShadow: '0 4px 16px rgba(124,58,237,0.08)', border: '1px solid #f3f4f6' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,58,237,0.15)';
                e.currentTarget.style.borderColor = '#7C3AED';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.08)';
                e.currentTarget.style.borderColor = '#f3f4f6';
              }}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">

                {/* Recruiter info */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
                  >
                    {recruiter.company_name?.[0]?.toUpperCase() || 'R'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{recruiter.company_name}</h3>
                    <p className="text-sm text-gray-500">{recruiter.full_name} · {recruiter.email}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {recruiter.designation && (
                        <span className="text-xs text-gray-500">💼 {recruiter.designation}</span>
                      )}
                      {recruiter.company_website && (
                        <a
                          href={recruiter.company_website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs"
                          style={{ color: '#7C3AED' }}
                        >
                          🌐 Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Approve / Reject buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleAction(recruiter.user_id, 'reject')}
                    disabled={updating === recruiter.user_id}
                    className="text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50"
                    style={{ color: '#dc2626', border: '1.5px solid #dc2626' }}
                    onMouseEnter={e => {
                      e.target.style.background = '#dc2626';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#dc2626';
                    }}
                  >
                    {updating === recruiter.user_id ? '...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleAction(recruiter.user_id, 'approve')}
                    disabled={updating === recruiter.user_id}
                    className="text-sm font-medium px-4 py-2 rounded-xl text-white transition-all duration-200 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
                    onMouseEnter={e => {
                      e.target.style.opacity = '0.9';
                      e.target.style.transform = 'scale(1.03)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.opacity = '1';
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {updating === recruiter.user_id ? '...' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}