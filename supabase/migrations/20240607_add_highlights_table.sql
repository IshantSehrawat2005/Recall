-- Migration: Add highlights table for Recall app
CREATE TABLE IF NOT EXISTS highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  text text NOT NULL,
  source_url text,
  tags text[],
  mood text,
  reflection text,
  created_at timestamp with time zone DEFAULT now()
);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_highlights_user_id ON highlights(user_id);
-- Index for search
CREATE INDEX IF NOT EXISTS idx_highlights_text ON highlights USING gin (to_tsvector('english', text)); 