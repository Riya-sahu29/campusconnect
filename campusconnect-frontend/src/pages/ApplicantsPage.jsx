import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import Spinner from '../components/Spinner.jsx';

const fixResumeUrl = (url) => {
  if (!url) return url;
  return url;
};

const statusOptions = ['applied', 'shortlisted', 'rejected', 'selected'];

const statusColors = {
  applied: { bg: '#eff6ff', color: '#3b82f6' },
  shortlisted: { bg: '#f0fdf4', color: '#16a34a' },
  rejected: { bg: '#fef2f2', color: '#dc2626' },
  selected: { bg: '#fdf4ff', color: '#7C3AED' },
};

export default function ApplicantsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axiosInstance.get(`/applications/job/${jobId}`);
        setApplicants(res.data.applicants);
      } catch (err) {
        setError('Failed to load applicants.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (applicationId, newStatus) => {
    setUpdating(applicationId);
    try {
      await axiosInstance.patch(`/applications/${applicationId}/status`, {
        status: newStatus,
      });
      setApplicants((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/recruiter')}
          className="text-sm font-medium mb-4 block"
          style={{ color: '#7C3AED' }}
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
        <p className="text-gray-500 text-sm mt-1">
          {applicants.length} applicant{applicants.length !== 1 ? 's' : ''} for this job
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {applicants.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #f3f4f6' }}
        >
          <p className="text-4xl mb-4">👥</p>
          <p className="text-lg font-medium text-gray-700">No applicants yet</p>
          <p className="text-sm text-gray-400 mt-1">Applicants will appear here once students apply</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <div
              key={applicant.id}
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

                {/* Student info */}
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
                  >
                    {applicant.full_name?.[0]?.toUpperCase() || 'S'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{applicant.full_name}</h3>
                    <p className="text-sm text-gray-500">{applicant.email}</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="text-xs text-gray-500">🎓 {applicant.branch}</span>
                      <span className="text-xs text-gray-500">📅 {applicant.passing_year}</span>
                      <span className="text-xs text-gray-500">⭐ CGPA: {applicant.cgpa}</span>
                    </div>
                  </div>
                </div>

                {/* Status + actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
                    style={{
                      background: statusColors[applicant.status]?.bg || '#f3f4f6',
                      color: statusColors[applicant.status]?.color || '#6b7280',
                    }}
                  >
                    {applicant.status}
                  </span>

                  {applicant.resume_url && (
                    <a
                      href={fixResumeUrl(applicant.resume_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
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
                      📄 Resume
                    </a>
                  )}
                </div>
              </div>

              {/* Status update */}
              <div
                className="mt-4 pt-4 flex items-center gap-3 flex-wrap"
                style={{ borderTop: '1px solid #f3f4f6' }}
              >
                <span className="text-xs font-medium text-gray-500">Update status:</span>
                <div className="flex gap-2 flex-wrap">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(applicant.id, status)}
                      disabled={applicant.status === status || updating === applicant.id}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg capitalize transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={
                        applicant.status === status
                          ? {
                              background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                              color: 'white',
                              border: '1.5px solid transparent',
                            }
                          : {
                              background: 'transparent',
                              color: '#6b7280',
                              border: '1.5px solid #e5e7eb',
                            }
                      }
                      onMouseEnter={e => {
                        if (applicant.status !== status && updating !== applicant.id) {
                          e.target.style.borderColor = '#7C3AED';
                          e.target.style.color = '#7C3AED';
                        }
                      }}
                      onMouseLeave={e => {
                        if (applicant.status !== status) {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.color = '#6b7280';
                        }
                      }}
                    >
                      {updating === applicant.id ? '...' : status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}