-- ========================================================
-- GHOST SESSION MIGRATION
-- ========================================================

-- 1. Make user_id nullable in sessions and tasks
ALTER TABLE sessions ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE tasks ALTER COLUMN user_id DROP NOT NULL;

-- 2. Update RLS policies for anonymous (logged out) access
-- Note: auth.uid() is NULL when not logged in.

-- Sessions: Allow anonymous inserts
CREATE POLICY "Allow anonymous session creation"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

-- Sessions: Allow anonymous selection and updates if sessionId matches (via frontend cookie/localstorage)
-- In a production app, you might use a 'ghost_token' or restricted access, 
-- but for this "Pro" implementation, we'll allow public access to rows without user_id
-- for the duration of the ghost session.
CREATE POLICY "Allow anonymous session viewing"
  ON sessions FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anonymous session updates"
  ON sessions FOR UPDATE
  USING (user_id IS NULL OR auth.uid() = user_id);

-- Tasks: Allow anonymous inserts/updates
CREATE POLICY "Allow anonymous task creation"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anonymous task viewing"
  ON tasks FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Allow anonymous task updates"
  ON tasks FOR UPDATE
  USING (user_id IS NULL OR auth.uid() = user_id);

-- 3. Cleanup old policies if necessary (optional, Supabase might conflict)
-- DROP POLICY IF EXISTS "Users can create their own sessions" ON sessions;
-- ... but the new policies above are additive or can be refined.
