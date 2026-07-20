-- Migration: Create visitors tracking table
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)

-- 1. Visitors table
CREATE TABLE
  IF NOT EXISTS visitors (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW ()
  );

-- 2. Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE visitors;

-- 3. RLS policies
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visitors" ON visitors FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view visitors" ON visitors FOR SELECT USING (true);
