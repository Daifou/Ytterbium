-- Ytterbium Database Schema Migration
-- Execute this in your Supabase SQL Editor

-- ==================== PROFILES TABLE ====================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure all columns exist (in case table already existed)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_reserve INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS free_sessions_used INTEGER DEFAULT 0;

-- Ensure email is unique (important for Whop lookup)
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_email_key') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
  END IF;
END $$;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ==================== SESSIONS TABLE ====================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER NOT NULL,
  elapsed_seconds INTEGER NOT NULL DEFAULT 0,
  type TEXT NOT NULL CHECK (type IN ('FOCUS', 'RELAX')),
  focus_intensity INTEGER NOT NULL CHECK (focus_intensity >= 1 AND focus_intensity <= 10),
  fqs INTEGER NOT NULL DEFAULT 0 CHECK (fqs >= 0 AND fqs <= 100),
  status TEXT NOT NULL CHECK (status IN ('IDLE', 'RUNNING', 'PAUSED', 'COMPLETED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Sessions policies
DROP POLICY IF EXISTS "Users can view their own sessions" ON sessions;
CREATE POLICY "Users can view their own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can create their own sessions" ON sessions;
CREATE POLICY "Users can create their own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update their own sessions" ON sessions;
CREATE POLICY "Users can update their own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete their own sessions" ON sessions;
CREATE POLICY "Users can delete their own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ==================== TASKS TABLE ====================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Tasks policies
DROP POLICY IF EXISTS "Users can view their own tasks" ON tasks;
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can create their own tasks" ON tasks;
CREATE POLICY "Users can create their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update their own tasks" ON tasks;
CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can delete their own tasks" ON tasks;
CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ==================== FATIGUE METRICS TABLE ====================
CREATE TABLE IF NOT EXISTS fatigue_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  timestamp BIGINT NOT NULL,
  keystroke_latency_ms DOUBLE PRECISION NOT NULL,
  typing_speed_wpm DOUBLE PRECISION NOT NULL,
  mouse_distance_px DOUBLE PRECISION NOT NULL,
  mouse_velocity_px_per_sec DOUBLE PRECISION NOT NULL,
  erratic_mouse_movement BOOLEAN NOT NULL,
  fatigue_score INTEGER NOT NULL CHECK (fatigue_score >= 0 AND fatigue_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE fatigue_metrics ENABLE ROW LEVEL SECURITY;

-- Fatigue metrics policies (users can only access metrics for their own sessions)
DROP POLICY IF EXISTS "Users can view metrics for their own sessions" ON fatigue_metrics;
CREATE POLICY "Users can view metrics for their own sessions"
  ON fatigue_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = fatigue_metrics.session_id
      AND (sessions.user_id = auth.uid() OR sessions.user_id IS NULL)
    )
  );

DROP POLICY IF EXISTS "Users can create metrics for their own sessions" ON fatigue_metrics;
CREATE POLICY "Users can create metrics for their own sessions"
  ON fatigue_metrics FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = fatigue_metrics.session_id
      AND (sessions.user_id = auth.uid() OR sessions.user_id IS NULL)
    )
  );

-- ==================== INDEXES FOR PERFORMANCE ====================
-- Essential indexes for frequent queries
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- Composite indexes for session lookups (Dashboard stats)
CREATE INDEX IF NOT EXISTS idx_sessions_user_status_type ON sessions(user_id, status, type);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON sessions(created_at DESC);

-- Tasks lookups
CREATE INDEX IF NOT EXISTS idx_tasks_user_id_completed ON tasks(user_id, completed);
CREATE INDEX IF NOT EXISTS idx_tasks_session_id ON tasks(session_id);

-- Metrics
CREATE INDEX IF NOT EXISTS idx_fatigue_metrics_session_id ON fatigue_metrics(session_id);

-- ==================== FUNCTIONS ====================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile automatically
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function for atomic reserve increment
CREATE OR REPLACE FUNCTION increment_reserve(user_id_param UUID, amount_param INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET total_reserve = COALESCE(total_reserve, 0) + amount_param,
      updated_at = NOW()
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
