import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import Spinner from '../components/Spinner.jsx';

export default function JobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});

  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    branch: '',
    page: 1,
  });

  const fetchJobs = async (params) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params.keyword) query.append('keyword', params.keyword);
      if (params.location) query.append('location', params.location);
      if (params.jobType) query.append('jobType', params.jobType);
      if (params.branch) query.append('branch', params.branch);
      query.append('page', params.page);
      query.append('limit', 6);

      const res = await axiosInstance.get(`/jobs?${query.toString()}`);
      setJobs(res.data.jobs);
      setPagination(res.data.pagination);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(filters);
  }, [filters.page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchJobs({ ...filters, page: 1 });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  const gradientBtn = {
    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
        <p className="text-gray-500 text-sm mt-1">Find your perfect opportunity</p>
      </div>

      {/* Search + Filters */}
      <form onSubmit={handleSearch}
        className="bg-white rounded-2xl p-5 mb-8"
        style={{ boxShadow: '0 4px 20px rgba(124,58,237,0.08)', border: '1px solid #f3f4f6' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={handleFilterChange}
            placeholder="Search keyword..."
            className="rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
            style={{ background: '#F3F4F6', border: '1.5px solid #F3F4F6' }}
            onFocus={e => { e.target.style.border = '1.5px solid #7C3AED'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.border = '1.5px solid #F3F4F6'; e.target.style.background = '#F3F4F6'; }}
          />
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Location..."
            className="rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
            style={{ background: '#F3F4F6', border: '1.5px solid #F3F4F6' }}
            onFocus={e => { e.target.style.border = '1.5px solid #7C3AED'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.border = '1.5px solid #F3F4F6'; e.target.style.background = '#F3F4F6'; }}
          />
          <select
            name="jobType"
            value={filters.jobType}
            onChange={handleFilterChange}
            className="rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none transition-all"
            style={{ background: '#F3F4F6', border: '1.5px solid #F3F4F6' }}
          >
            <option value="">All job types</option>
            <option value="full-time">Full-time</option>
            <option value="internship">Internship</option>
            <option value="part-time">Part-time</option>
          </select>
          <input
            type="text"
            name="branch"
            value={filters.branch}
            onChange={handleFilterChange}
            placeholder="Branch..."
            className="rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
            style={{ background: '#F3F4F6', border: '1.5px solid #F3F4F6' }}
            onFocus={e => { e.target.style.border = '1.5px solid #7C3AED'; e.target.style.background = '#fff'; }}
            onBlur={e => { e.target.style.border = '1.5px solid #F3F4F6'; e.target.style.background = '#F3F4F6'; }}
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={gradientBtn}
          onMouseEnter={e => { e.target.style.opacity = '0.9'; e.target.style.transform = 'scale(1.02)'; }}
          onMouseLeave={e => { e.target.style.opacity = '1'; e.target.style.transform = 'scale(1)'; }}
        >
          Search Jobs
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? <Spinner /> : (
        <>
          {/* Results count */}
          <p className="text-sm text-gray-500 mb-4">
            {pagination.totalCount ?? 0} job{pagination.totalCount !== 1 ? 's' : ''} found
          </p>

          {/* Job cards grid */}
          {jobs.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No jobs found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 cursor-pointer transition-all duration-300"
                  style={{ boxShadow: '0 4px 16px rgba(124,58,237,0.08)', border: '1px solid #f3f4f6' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(124,58,237,0.18)';
                    e.currentTarget.style.borderColor = '#7C3AED';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.08)';
                    e.currentTarget.style.borderColor = '#f3f4f6';
                  }}
                  onClick={() => navigate(`/jobs/${job.id}`)}
                >
                  {/* Company initial avatar */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
                    >
                      {job.company_name?.[0]?.toUpperCase() || 'C'}
                    </div>
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full capitalize"
                      style={{
                        background: job.job_type === 'internship' ? '#fdf4ff' : '#f0fdf4',
                        color: job.job_type === 'internship' ? '#a855f7' : '#16a34a',
                      }}
                    >
                      {job.job_type || 'Full-time'}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 text-base mb-1 line-clamp-1">{job.title}</h3>
                  <p className="text-sm font-medium mb-3" style={{ color: '#7C3AED' }}>{job.company_name}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                         {job.location}
                      </span>
                    )}
                    {job.ctc_lpa && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                         {job.ctc_lpa} LPA
                      </span>
                    )}
                  </div>

                  <button
                    className="w-full py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: 'white' }}
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40"
                style={{ border: '1.5px solid #7C3AED', color: '#7C3AED' }}
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-500 px-2">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: 'white', border: 'none' }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}