-- SAFE USER DATA RESET SCRIPT
-- This script deletes all user data while preserving the database schema
-- WARNING: THIS WILL PERMANENTLY DELETE ALL USER DATA

-- Step 1: Delete all fatigue metrics (will cascade from sessions)
DELETE FROM public.fatigue_metrics;

-- Step 2: Delete all tasks
DELETE FROM public.tasks;

-- Step 3: Delete all sessions
DELETE FROM public.sessions;

-- Step 4: Delete all profiles (this will NOT delete auth.users)
DELETE FROM public.profiles;

-- Step 5: Verify deletion
SELECT 'Profiles remaining:' as check_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Sessions remaining:', COUNT(*) FROM public.sessions
UNION ALL
SELECT 'Tasks remaining:', COUNT(*) FROM public.tasks
UNION ALL
SELECT 'Fatigue metrics remaining:', COUNT(*) FROM public.fatigue_metrics;

-- Note: You must manually delete users from Supabase Auth Dashboard
-- Go to: Authentication > Users > Select all users > Delete
-- OR use the Supabase Management API to delete auth.users programmatically
