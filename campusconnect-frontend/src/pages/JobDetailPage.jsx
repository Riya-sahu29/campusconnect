import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import Spinner from '../components/Spinner.jsx';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (err) {
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setError('');
    setSuccess('');
    try {
      await axiosInstance.post(`/applications/${id}`);
      setSuccess('Application submitted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply. Please try again.');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Spinner />;

  if (error && !job) return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* Back button */}
      <button
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-sm font-medium mb-6 transition-all"
        style={{ color: '#7C3AED' }}
        onMouseEnter={e => e.target.style.opacity = '0.7'}
        onMouseLeave={e => e.target.style.opacity = '1'}
      >
        ← Back to Jobs
      </button>

      {/* Main card */}
      <div
        className="bg-white rounded-2xl p-8 mb-5"
        style={{ boxShadow: '0 4px 24px rgba(124,58,237,0.1)', border: '1px solid #f3f4f6' }}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
          >
            {job?.company_name?.[0]?.toUpperCase() || 'C'}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{job?.title}</h1>
            <p className="font-medium mt-0.5" style={{ color: '#7C3AED' }}>{job?.company_name}</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {job?.location && (
                <span className="text-xs text-gray-500"> {job.location}</span>
              )}
              {job?.job_type && (
                <span
                  className="text-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
                  style={{ background: '#fdf4ff', color: '#a855f7' }}
                >
                  {job.job_type}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-xl mb-6"
          style={{ background: '#F3F4F6' }}
        >
          {job?.ctc_lpa && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">CTC</p>
              <p className="text-sm font-semibold text-gray-900">{job.ctc_lpa} LPA</p>
            </div>
          )}
          
          {job?.min_passing_year && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Batch</p>
              <p className="text-sm font-semibold text-gray-900">
                {job.min_passing_year} – {job.max_passing_year || job.min_passing_year}
              </p>
            </div>
          )}
          {job?.application_deadline && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Deadline</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(job.application_deadline).toLocaleDateString()}
              </p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Status</p>
            <p className="text-sm font-semibold" style={{ color: '#16a34a' }}>
              {job?.status === 'open' ? '🟢 Open' : '🔴 Closed'}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">About this role</h2>
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {job?.description}
          </p>
        </div>

        {/* Success / Error messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
           {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Apply button */}
        {job?.status === 'open' && !success && (
          <button
            onClick={handleApply}
            disabled={applying}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
            onMouseEnter={e => {
              if (!applying) {
                e.target.style.opacity = '0.9';
                e.target.style.transform = 'scale(1.01)';
                e.target.style.boxShadow = '0 8px 24px rgba(124,58,237,0.35)';
              }
            }}
            onMouseLeave={e => {
              e.target.style.opacity = '1';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {applying ? <Spinner /> : 'Apply Now'}
          </button>
        )}

        {job?.status !== 'open' && (
          <div className="text-center py-3 text-sm text-gray-400 bg-gray-50 rounded-xl">
            This job is no longer accepting applications
          </div>
        )}
      </div>
    </div>
  );
}