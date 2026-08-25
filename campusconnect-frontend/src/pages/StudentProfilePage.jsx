import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance.js';
import Spinner from '../components/Spinner.jsx';

const fixResumeUrl = (url) => {
  if (!url) return url;
  return url;
};

export default function StudentProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/students/me');
        setProfile(res.data.profile);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await axiosInstance.post('/students/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Resume uploaded successfully!');
      setProfile((prev) => ({ ...prev, resume_url: fixResumeUrl(res.data.resumeUrl) }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Your academic and personal details</p>
      </div>

      {/* Profile card */}
      <div
        className="bg-white rounded-2xl p-8 mb-5 transition-all duration-300"
        style={{ boxShadow: '0 4px 24px rgba(124,58,237,0.1)', border: '1px solid #f3f4f6' }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(124,58,237,0.18)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
          >
            {profile?.full_name?.[0]?.toUpperCase() || 'S'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.full_name}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-8">
          {[
            { label: 'Branch', value: profile?.branch },
            { label: 'Passing Year', value: profile?.passing_year },
            { label: 'CGPA', value: profile?.cgpa },
            { label: 'Phone', value: profile?.phone || '—' },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 rounded-xl"
              style={{ background: '#F3F4F6' }}
            >
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        {profile?.skills && profile.skills.length > 0 && (
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-700 mb-3">Skills</p>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{ background: '#fdf4ff', color: '#7C3AED', border: '1px solid #e9d5ff' }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Resume section */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Resume</p>

          {profile?.resume_url ? (
            <div
              className="flex items-center justify-between p-4 rounded-xl mb-3"
              style={{ background: '#F3F4F6' }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📄</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Resume uploaded</p>
                  <p className="text-xs text-gray-500">Click to view</p>
                </div>
              </div>

              <a
                href={fixResumeUrl(profile.resume_url)}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium px-4 py-1.5 rounded-lg transition-all"
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
                View
              </a>
            </div>
          ) : (
            <div
              className="p-4 rounded-xl mb-3 text-sm text-gray-500"
              style={{ background: '#FFF7ED', border: '1px dashed #fdba74' }}
            >
               No resume uploaded yet. Upload one to start applying to jobs.
            </div>
          )}

          {/* Upload button */}
          <label
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {uploading ? <Spinner /> : (
              <>
                <span>📤</span>
                {profile?.resume_url ? 'Replace Resume' : 'Upload Resume'}
              </>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Messages */}
        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
             {success}
          </div>
        )}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
