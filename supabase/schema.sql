-- =============================================
-- Portfolio Database Schema
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Profiles table (single row for your info)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  hero jsonb NOT NULL DEFAULT '{}',
  education jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- 2. Experience table
CREATE TABLE IF NOT EXISTS experience (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  company text NOT NULL,
  role text NOT NULL,
  period text NOT NULL,
  current boolean DEFAULT false,
  highlights text[] DEFAULT '{}',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 3. Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  tags text[] DEFAULT '{}',
  github text,
  demo text,
  featured boolean DEFAULT false,
  date date DEFAULT CURRENT_DATE,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 4. Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category text NOT NULL UNIQUE,
  items text[] DEFAULT '{}',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5. Blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text,
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  published_at date DEFAULT CURRENT_DATE,
  read_time int DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured, date DESC);
CREATE INDEX IF NOT EXISTS idx_experience_sort ON experience(sort_order);
CREATE INDEX IF NOT EXISTS idx_skills_sort ON skills(sort_order);

-- =============================================
-- Row Level Security (RLS)
-- Public read, authenticated write
-- =============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read experience" ON experience FOR SELECT USING (true);
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Public read published blogs" ON blogs FOR SELECT USING (published = true);

-- Authenticated write policies
CREATE POLICY "Auth insert profiles" ON profiles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update profiles" ON profiles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete profiles" ON profiles FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert experience" ON experience FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update experience" ON experience FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete experience" ON experience FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update projects" ON projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete projects" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert skills" ON skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update skills" ON skills FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete skills" ON skills FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert blogs" ON blogs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update blogs" ON blogs FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete blogs" ON blogs FOR DELETE TO authenticated USING (true);
CREATE POLICY "Auth read all blogs" ON blogs FOR SELECT TO authenticated USING (true);

-- =============================================
-- Seed data (optional - run after creating tables)
-- =============================================

-- Insert profile
INSERT INTO profiles (id, hero, education) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '{
    "name": "Soumya Das",
    "title": "AI Engineer",
    "tagline": "Building intelligent systems that scale",
    "bio": "AI Engineer focused on LLM infrastructure, distributed systems, and edge deployment. Currently at SuperAlign.ai, building benchmarking pipelines across 100+ GPUs.",
    "location": "India",
    "socials": [
      {"label": "GitHub", "url": "https://github.com/riCl3"},
      {"label": "LinkedIn", "url": "https://linkedin.com/in/soumya-das-nit"},
      {"label": "Email", "url": "mailto:soumyaric2@gmail.com"}
    ],
    "resume_files": [
      {"label": "AI Engineer", "file": "/resume/AI_Engineer.pdf"},
      {"label": "Backend / SDE / SWE", "file": "/resume/Backend_SDE_SWE.pdf"}
    ]
  }',
  '{
    "institution": "Motilal Nehru National Institute of Technology Allahabad (NIT Allahabad)",
    "degree": "B.Tech in Electronics and Communication Engineering",
    "period": "2022 - 2026",
    "cgpa": "8.64"
  }'
) ON CONFLICT (id) DO NOTHING;

-- Insert experience
INSERT INTO experience (company, role, period, current, highlights, sort_order) VALUES
  ('SuperAlign.ai', 'AI Engineer Intern', 'Nov 2025 - Present', true,
   ARRAY['Building distributed LLM benchmarking systems across 100+ GPUs', 'Managing bare-metal resources with Proxmox and Coolify', 'Optimizing inference pipelines using vLLM and ONNX runtime'], 1),
  ('ByteBeam', 'Founder', 'Jul 2025 - Present', false,
   ARRAY['Prototyping LiFi high-speed optical communication systems', 'Leading hardware-software integration for IoT applications'], 2);

-- Insert projects
INSERT INTO projects (title, description, tags, github, demo, featured, date, sort_order) VALUES
  ('PII & PHI Detection Browser Agent', 'Browser extension using transformer models for real-time detection of sensitive data. Optimized for edge deployment with ONNX runtime.',
   ARRAY['DeBERTa-v3', 'ONNX', 'PyTorch'], 'https://github.com/riCl3', null, true, '2026-01-15', 1),
  ('Noties v2.0', 'Local AI meeting assistant with real-time transcription using Whisper. Captures audio via WASAPI loopback for privacy-first note-taking.',
   ARRAY['Whisper', 'WASAPI'], 'https://github.com/riCl3', null, false, '2025-11-20', 2),
  ('Queuebit', 'Asynchronous document processing pipeline with job queuing. Built on Redis streams and BullMQ for scalable batch operations.',
   ARRAY['Redis', 'BullMQ'], 'https://github.com/riCl3', null, false, '2025-08-10', 3);

-- Insert skills
INSERT INTO skills (category, items, sort_order) VALUES
  ('Languages', ARRAY['Python', 'C++', 'Kotlin', 'TypeScript', 'SQL'], 1),
  ('Frameworks', ARRAY['PyTorch', 'React', 'FastAPI', 'Node.js', 'LangChain'], 2),
  ('ML/AI', ARRAY['Transformers', 'ONNX', 'vLLM', 'Whisper', 'DeBERTa'], 3),
  ('Infrastructure', ARRAY['Docker', 'Redis', 'AWS', 'Linux', 'Proxmox', 'Coolify', 'LLMOps'], 4),
  ('Tools', ARRAY['Git', 'VS Code', 'Linux CLI'], 5);

-- Insert sample blog
INSERT INTO blogs (title, slug, excerpt, content, tags, featured, published, published_at, read_time) VALUES
  ('Building Distributed LLM Benchmarks Across GPU Clusters', 'distributed-llm-benchmarks',
   'Lessons learned from running evaluation pipelines across 100+ GPUs and optimizing throughput.',
   '## The Problem

Running LLM evaluations on a single GPU is fine for small models, but when you''re benchmarking 70B+ parameter models across multiple tasks, you need distributed infrastructure.

## Architecture

We built a pipeline that distributes evaluation tasks across 100+ GPUs using a custom job scheduler.',
   ARRAY['LLM', 'Infrastructure', 'GPU'], true, true, '2025-12-15', 8);
