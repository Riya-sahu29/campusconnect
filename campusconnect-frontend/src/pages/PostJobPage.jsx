import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import Spinner from '../components/Spinner.jsx';

export default function PostJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    jobType: '',
    minPassingYear: '',
    maxPassingYear: '',
    ctcLpa: '',
    applicationDeadline: '',
    eligibleBranches: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...formData,
        minCgpa: formData.minCgpa ? parseFloat(formData.minCgpa) : undefined,
        minPassingYear: formData.minPassingYear ? parseInt(formData.minPassingYear) : undefined,
        maxPassingYear: formData.maxPassingYear ? parseInt(formData.maxPassingYear) : undefined,
        ctcLpa: formData.ctcLpa ? parseFloat(formData.ctcLpa) : undefined,
        eligibleBranches: formData.eligibleBranches
          ? formData.eligibleBranches.split(',').map((b) => b.trim()).filter(Boolean)
          : [],
      };
      await axiosInstance.post('/jobs', payload);
      navigate('/recruiter');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all";
  const inputStyle = { background: '#F3F4F6', border: '1.5px solid #F3F4F6' };
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  const handleFocus = (e) => {
    e.target.style.border = '1.5px solid #7C3AED';
    e.target.style.background = '#fff';
    e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)';
  };
  const handleBlur = (e) => {
    e.target.style.border = '1.5px solid #F3F4F6';
    e.target.style.background = '#F3F4F6';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/recruiter')}
          className="text-sm font-medium mb-4 block transition-all"
          style={{ color: '#7C3AED' }}
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in the details below</p>
      </div>

      {/* Card */}
      <div
        className="bg-white rounded-2xl p-8"
        style={{ boxShadow: '0 4px 24px rgba(124,58,237,0.1)', border: '1px solid #f3f4f6' }}
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className={labelClass}>Job Title *</label>
            <input type="text" name="title" value={formData.title}
              onChange={handleChange} required placeholder="e.g. Backend Developer"
              className={inputClass} style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              name="description" value={formData.description}
              onChange={handleChange} required
              placeholder="Describe the role, responsibilities, and requirements..."
              rows={4}
              className={inputClass} style={{ ...inputStyle, resize: 'none' }}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" name="location" value={formData.location}
                onChange={handleChange} placeholder="e.g. Bangalore"
                className={inputClass} style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label className={labelClass}>Job Type</label>
              <select name="jobType" value={formData.jobType}
                onChange={handleChange}
                className={inputClass} style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              >
                <option value="">Select type</option>
                <option value="full-time">Full-time</option>
                <option value="internship">Internship</option>
                <option value="part-time">Part-time</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            
            <div>
              <label className={labelClass}>CTC (LPA)</label>
              <input type="number" name="ctcLpa" value={formData.ctcLpa}
                onChange={handleChange} placeholder="e.g. 8.5"
                step="0.1" min="0"
                className={inputClass} style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Min Passing Year</label>
              <input type="number" name="minPassingYear" value={formData.minPassingYear}
                onChange={handleChange} placeholder="e.g. 2025"
                className={inputClass} style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>
            <div>
              <label className={labelClass}>Max Passing Year</label>
              <input type="number" name="maxPassingYear" value={formData.maxPassingYear}
                onChange={handleChange} placeholder="e.g. 2026"
                className={inputClass} style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Application Deadline</label>
            <input type="date" name="applicationDeadline" value={formData.applicationDeadline}
              onChange={handleChange}
              className={inputClass} style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur} />
          </div>

          <div>
            <label className={labelClass}>Eligible Branches</label>
            <input type="text" name="eligibleBranches" value={formData.eligibleBranches}
              onChange={handleChange}
              placeholder="e.g. Computer Science, IT (comma separated, leave empty for all)"
              className={inputClass} style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur} />
            <p className="text-xs text-gray-400 mt-1">Leave empty to allow all branches</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
            onMouseEnter={e => {
              if (!loading) {
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
            {loading ? <Spinner /> : 'Post Job'}
          </button>
        </form>
      </div>
    </div>
  );
}