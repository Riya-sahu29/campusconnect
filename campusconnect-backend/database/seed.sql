
-- USERS

-- 1 Admin
INSERT INTO users (id, email, password_hash, role, full_name)
VALUES
('11111111-1111-1111-1111-111111111111',
 'admin@campusconnect.com',
 '$2b$10$f3NuyhdoLLoIlKEV5d.4JeiusyFDpReiCadjEuPgk2FxzEVeigvIW',
 'admin', 'System Admin');

-- 2 Students
INSERT INTO users (id, email, password_hash, role, full_name)
VALUES
('22222222-2222-2222-2222-222222222221', 
'riya.student@campusconnect.com',
 '$2b$10$f3NuyhdoLLoIlKEV5d.4JeiusyFDpReiCadjEuPgk2FxzEVeigvIW',
 'student', 'Riya Sahu'),
('22222222-2222-2222-2222-222222222222', 
'amit.student@campusconnect.com',
 '$2b$10$f3NuyhdoLLoIlKEV5d.4JeiusyFDpReiCadjEuPgk2FxzEVeigvIW',
 'student', 'Amit Kumar');

-- 2 Recruiters (one approved, one pending — to test the admin approval flow)
INSERT INTO users (id, email, password_hash, role, full_name)
VALUES
('33333333-3333-3333-3333-333333333331', 'hr@techcorp.com',
 '$2b$10$f3NuyhdoLLoIlKEV5d.4JeiusyFDpReiCadjEuPgk2FxzEVeigvIW',
 'recruiter', 'Neha Verma'),
('33333333-3333-3333-3333-333333333332', 'hr@startupxyz.com',
 '$2b$10$f3NuyhdoLLoIlKEV5d.4JeiusyFDpReiCadjEuPgk2FxzEVeigvIW',
 'recruiter', 'Rahul Singh');


-- STUDENT PROFILES

INSERT INTO student_profiles (user_id, branch, passing_year, cgpa, skills, phone)
VALUES
('22222222-2222-2222-2222-222222222221', 'Computer Science', 2026, 8.04,
 ARRAY['Python', 'FastAPI', 'React', 'MongoDB', 'LangChain'], '9000000001'),
('22222222-2222-2222-2222-222222222222', 'Information Technology', 2026, 7.50,
 ARRAY['Java', 'Spring Boot', 'MySQL'], '9000000002');

-- RECRUITER PROFILES

INSERT INTO recruiter_profiles (user_id, company_name, company_website, designation, status, approved_by, approved_at)
VALUES
('33333333-3333-3333-3333-333333333331', 'TechCorp Solutions', 'https://techcorp.example.com',
 'HR Manager', 'approved', '11111111-1111-1111-1111-111111111111', now());

-- StartupXYZ is still pending admin approval
INSERT INTO recruiter_profiles (user_id, company_name, company_website, designation, status)
VALUES
('33333333-3333-3333-3333-333333333332', 'StartupXYZ', 'https://startupxyz.example.com',
 'Talent Acquisition Lead', 'pending');


-- JOBS

INSERT INTO jobs (id, recruiter_id, title, description, location, job_type, min_cgpa, min_passing_year, max_passing_year, ctc_lpa, status, application_deadline)
VALUES
('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331',
 'Backend Developer (Node.js)',
 'Looking for a backend developer skilled in Node.js, Express, and PostgreSQL to join our growing engineering team.',
 'Bangalore', 'full-time', 7.00, 2025, 2026, 8.50, 'open', now() + interval '30 days'),

('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333331',
 'AI/GenAI Engineer Intern',
 'Internship for students passionate about LLMs, LangChain, and building AI-powered applications.',
 'Remote', 'internship', 7.50, 2026, 2026, 0.50, 'open', now() + interval '20 days');


-- JOB ELIGIBLE BRANCHES

INSERT INTO job_eligible_branches (job_id, branch) VALUES
('44444444-4444-4444-4444-444444444441', 'Computer Science'),
('44444444-4444-4444-4444-444444444441', 'Information Technology'),
('44444444-4444-4444-4444-444444444442', 'Computer Science');


-- APPLICATIONS

INSERT INTO applications (job_id, student_id, status, resume_url)
VALUES
('44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222221',
 'applied', 'https://res.cloudinary.com/demo/sample_resume_riya.pdf');


-- NOTIFICATIONS

INSERT INTO notifications (user_id, type, message, metadata)
VALUES
('33333333-3333-3333-3333-333333333331', 'new_application',
 'Riya Sahu applied to your job: Backend Developer (Node.js)',
 '{"job_id": "44444444-4444-4444-4444-444444444441"}');