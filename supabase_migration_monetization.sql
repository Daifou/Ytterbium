-- Add free_sessions_used to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS free_sessions_used INTEGER DEFAULT 0;

-- Update RLS policy to allow users to read their own usage
create policy "Users can view their own profile usage"
on profiles for select
using ( auth.uid() = id );
