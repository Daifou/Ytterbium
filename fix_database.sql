-- FIX SCRIPT: Run this if tables exist but have 406 errors
-- This will properly configure the database without recreating everything

-- 1. Make sure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fatigue_metrics ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies (in case they're malformed)
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can create sessions" ON sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON sessions;
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;
DROP POLICY IF EXISTS "Users can view their own metrics" ON fatigue_metrics;
DROP POLICY IF EXISTS "Users can create their own metrics" ON fatigue_metrics;

-- 3. Recreate policies correctly
-- Profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Sessions  
CREATE POLICY "Users can view their own sessions" ON sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create sessions" ON sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own sessions" ON sessions
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- Fatigue Metrics
CREATE POLICY "Users can view their own metrics" ON fatigue_metrics
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id)
  );

CREATE POLICY "Users can create their own metrics" ON fatigue_metrics
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM sessions WHERE id = session_id) OR
    (SELECT user_id FROM sessions WHERE id = session_id) IS NULL
  );

-- 4. Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON sessions TO authenticated;
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON fatigue_metrics TO authenticated;

GRANT ALL ON profiles TO anon;
GRANT ALL ON sessions TO anon;
GRANT ALL ON tasks TO anon;
GRANT ALL ON fatigue_metrics TO anon;
