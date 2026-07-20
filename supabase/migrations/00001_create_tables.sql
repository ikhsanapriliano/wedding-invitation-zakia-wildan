-- Migration: Create wedding invitation tables
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)
-- 1. RSVP table
CREATE TABLE
  IF NOT EXISTS rsvps (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    attendance TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir')),
    guests_count INTEGER DEFAULT 0,
    phone_number TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW (),
    checked_in BOOLEAN DEFAULT FALSE,
    check_in_time TIMESTAMPTZ,
    wa_sent BOOLEAN DEFAULT FALSE,
    wa_sent_count INTEGER DEFAULT 0
  );

-- 2. Guest messages table
CREATE TABLE
  IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW ()
  );

-- 3. Enable Realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE rsvps;

ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 4. Add new columns to existing table (run separately if table already exists)
-- ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS wa_sent BOOLEAN DEFAULT FALSE;
-- ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS wa_sent_count INTEGER DEFAULT 0;