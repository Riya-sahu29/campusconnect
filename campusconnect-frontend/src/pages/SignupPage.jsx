import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../store/authSlice.js';
import axiosInstance from '../api/axiosInstance.js';
import Spinner from '../components/Spinner.jsx';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    email: '', password: '', fullName: '',
    branch: '', passingYear: '', cgpa: '',
    companyName: '', companyWebsite: '', designation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/signup', { ...formData, role });
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate(res.data.user.role === 'recruiter' ? '/recruiter' : '/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: '#F3F4F6',
    border: '1.5px solid #F3F4F6',
  };

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

  const inputClass = "w-full rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CampusConnect</h1>
          <p className="text-gray-500 text-sm mt-2">Create your account today</p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-3xl p-8"
          style={{
            boxShadow: '0 4px 24px rgba(124, 58, 237, 0.12)',
            border: '1px solid #f3f4f6',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 16px 40px rgba(124, 58, 237, 0.2)';
            e.currentTarget.style.transform = 'translateY(-8px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(124, 58, 237, 0.12)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Get started</h2>

          {/* Role toggle */}
          <div className="flex rounded-xl p-1 mb-6 gap-1" style={{ background: '#F3F4F6' }}>
            {['student', 'recruiter'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize"
                style={
                  role === r
                    ? { background: 'linear-gradient(135deg, #7C3AED, #EC4899)', color: 'white' }
                    : { background: 'transparent', color: '#6b7280' }
                }
              >
                {r}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <input type="text" name="fullName" value={formData.fullName}
                onChange={handleChange} required placeholder="Riya Sahu"
                className={inputClass} style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" name="email" value={formData.email}
                onChange={handleChange} required placeholder="you@example.com"
                className={inputClass} style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={formData.password}
                onChange={handleChange} required placeholder="Min. 8 characters"
                className={inputClass} style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            {role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Branch</label>
                  <input type="text" name="branch" value={formData.branch}
                    onChange={handleChange} required placeholder="Computer Science"
                    className={inputClass} style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Passing year</label>
                    <input type="number" name="passingYear" value={formData.passingYear}
                      onChange={handleChange} required placeholder="2026"
                      className={inputClass} style={inputStyle}
                      onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">CGPA</label>
                    <input type="number" name="cgpa" value={formData.cgpa}
                      onChange={handleChange} required placeholder="8.5"
                      step="0.01" min="0" max="10"
                      className={inputClass} style={inputStyle}
                      onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                </div>
              </>
            )}

            {role === 'recruiter' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company name</label>
                  <input type="text" name="companyName" value={formData.companyName}
                    onChange={handleChange} required placeholder="Acme Corp"
                    className={inputClass} style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Designation</label>
                  <input type="text" name="designation" value={formData.designation}
                    onChange={handleChange} placeholder="HR Manager"
                    className={inputClass} style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Company website</label>
                  <input type="url" name="companyWebsite" value={formData.companyWebsite}
                    onChange={handleChange} placeholder="https://yourcompany.com"
                    className={inputClass} style={inputStyle}
                    onFocus={handleFocus} onBlur={handleBlur} />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
              onMouseEnter={e => {
                if (!loading) {
                  e.target.style.background = 'linear-gradient(135deg, #6d28d9, #db2777)';
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 8px 24px rgba(124,58,237,0.4)';
                }
              }}
              onMouseLeave={e => {
                e.target.style.background = 'linear-gradient(135deg, #7C3AED, #EC4899)';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {loading ? <Spinner /> : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold" style={{ color: '#7C3AED' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}