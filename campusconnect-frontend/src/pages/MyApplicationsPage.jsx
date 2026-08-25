import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import Spinner from '../components/Spinner.jsx';

const fixResumeUrl = (url) => {
  if (!url) return url;
  return url;
};

const statusColors = {
  applied: { bg: '#eff6ff', color: '#3b82f6' },
  shortlisted: { bg: '#f0fdf4', color: '#16a34a' },
  rejected: { bg: '#fef2f2', color: '#dc2626' },
  selected: { bg: '#fdf4ff', color: '#7C3AED' },
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axiosInstance.get('/applications/my-applications');
        setApplications(res.data.applications);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-500 text-sm mt-1">
          {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #f3f4f6' }}
        >
          <p className="text-4xl mb-4">📭</p>
          <p className="text-lg font-medium text-gray-700">No applications yet</p>
          <p className="text-sm text-gray-400 mt-1">Browse jobs and apply to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
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
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
                  >
                    {app.company_name?.[0]?.toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.title}</h3>
                    <p className="text-sm font-medium" style={{ color: '#7C3AED' }}>
                      {app.company_name}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {app.location && (
                        <span className="text-xs text-gray-500"> {app.location}</span>
                      )}
                      {app.job_type && (
                        <span className="text-xs text-gray-500 capitalize"> {app.job_type}</span>
                      )}
                      {app.ctc_lpa && (
                        <span className="text-xs text-gray-500"> {app.ctc_lpa} LPA</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
                    style={{
                      background: statusColors[app.status]?.bg || '#f3f4f6',
                      color: statusColors[app.status]?.color || '#6b7280',
                    }}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Resume link */}
              {app.resume_url && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid #f3f4f6' }}>
                  <a
                    href={fixResumeUrl(app.resume_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium"
                    style={{ color: '#7C3AED' }}
                  >
                    📄 View submitted resume
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}