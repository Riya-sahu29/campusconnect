import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import Spinner from '../components/Spinner.jsx';

const statusColors = {
  open: { bg: '#f0fdf4', color: '#16a34a' },
  closed: { bg: '#fef2f2', color: '#dc2626' },
  draft: { bg: '#f3f4f6', color: '#6b7280' },
};

export default function RecruiterDashboardPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get('/jobs/my-jobs');
        setJobs(res.data.jobs);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Job Postings</h1>
          <p className="text-gray-500 text-sm mt-1">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
          </p>
        </div>
        <button
          onClick={() => navigate('/recruiter/post-job')}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
          onMouseEnter={e => {
            e.target.style.opacity = '0.9';
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 8px 24px rgba(124,58,237,0.35)';
          }}
          onMouseLeave={e => {
            e.target.style.opacity = '1';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }}
        >
          + Post a Job
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {jobs.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ boxShadow: '0 4px 24px rgba(124,58,237,0.08)', border: '1px solid #f3f4f6' }}
        >
          <p className="text-4xl mb-4">📋</p>
          <p className="text-lg font-medium text-gray-700">No jobs posted yet</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Create your first job posting</p>
          <button
            onClick={() => navigate('/recruiter/post-job')}
            className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
          >
            Post a Job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
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
                <div>
                  <h3 className="font-semibold text-gray-900 text-base">{job.title}</h3>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {job.location && (
                      <span className="text-xs text-gray-500"> {job.location}</span>
                    )}
                    {job.job_type && (
                      <span className="text-xs text-gray-500 capitalize"> {job.job_type}</span>
                    )}
                    {job.ctc_lpa && (
                      <span className="text-xs text-gray-500"> {job.ctc_lpa} LPA</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full capitalize"
                    style={{
                      background: statusColors[job.status]?.bg || '#f3f4f6',
                      color: statusColors[job.status]?.color || '#6b7280',
                    }}
                  >
                    {job.status}
                  </span>
                  <button
                    onClick={() => navigate(`/recruiter/applicants/${job.id}`)}
                    className="text-xs font-medium px-4 py-1.5 rounded-lg transition-all"
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
                    View Applicants
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