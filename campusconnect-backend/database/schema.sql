CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('student', 'recruiter', 'admin');
CREATE TYPE recruiter_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft');
CREATE TYPE application_status AS ENUM ('applied', 'shortlisted', 'rejected', 'selected');

--users (single auth table for all 3 roles)

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(225) UNIQUE NOT NULL,
    password_hash VARCHAR(225) NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_role ON users(role);

-- STUDENT PROFILES 

CREATE TABLE student_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    branch            VARCHAR(100) NOT NULL,
    passing_year      SMALLINT NOT NULL,
    cgpa              NUMERIC(4,2) NOT NULL CHECK (cgpa >= 0 AND cgpa <= 10),
    resume_url        TEXT,
    resume_public_id  TEXT,
    phone             VARCHAR(20),
    skills            TEXT[],
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE INDEX idx_student_branch ON student_profiles(branch);
CREATE INDEX idx_student_passing_year ON student_profiles(passing_year);
CREATE INDEX idx_student_cgpa ON student_profiles(cgpa);
CREATE INDEX idx_student_skills ON student_profiles USING GIN (skills);

-- RECRUITER PROFILES

CREATE TABLE recruiter_profiles (
    user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    company_name    VARCHAR(150) NOT NULL,
    company_website VARCHAR(255),
    designation     VARCHAR(100),
    status          recruiter_status NOT NULL DEFAULT 'pending',
    approved_by     UUID REFERENCES users(id),
    approved_at     TIMESTAMPTZ,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recruiter_status ON recruiter_profiles(status);

-- JOBS

CREATE TABLE jobs (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title                VARCHAR(150) NOT NULL,
    description          TEXT NOT NULL,
    location             VARCHAR(100),
    job_type             VARCHAR(50),
    min_cgpa             NUMERIC(4,2) NOT NULL DEFAULT 0,
    min_passing_year     SMALLINT,
    max_passing_year     SMALLINT,
    ctc_lpa              NUMERIC(6,2),
    status               job_status NOT NULL DEFAULT 'open',
    application_deadline TIMESTAMPTZ,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_recruiter ON jobs(recruiter_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_min_cgpa ON jobs(min_cgpa);
CREATE INDEX idx_jobs_search ON jobs USING GIN (to_tsvector('english', title || ' ' || description));


-- JOB ELIGIBLE BRANCHES (many-to-many: job <-> branch)

CREATE TABLE job_eligible_branches (
    job_id  UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    branch  VARCHAR(100) NOT NULL,
    PRIMARY KEY (job_id, branch)
);

CREATE INDEX idx_job_branches_branch ON job_eligible_branches(branch);


-- APPLICATIONS (student applies to a job)

CREATE TABLE applications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    student_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      application_status NOT NULL DEFAULT 'applied',
    resume_url  TEXT NOT NULL,
    applied_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (job_id, student_id)
);

CREATE INDEX idx_applications_job ON applications(job_id);
CREATE INDEX idx_applications_student ON applications(student_id);
CREATE INDEX idx_applications_status ON applications(status);


-- NOTIFICATIONS (for Socket.IO real-time delivery + history)

CREATE TABLE notifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(50) NOT NULL,
    message    TEXT NOT NULL,
    is_read    BOOLEAN NOT NULL DEFAULT false,
    metadata   JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);


-- AUTO-UPDATE updated_at TRIGGER

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_student_profiles
    BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_recruiter_profiles
    BEFORE UPDATE ON recruiter_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_jobs
    BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_applications
    BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();