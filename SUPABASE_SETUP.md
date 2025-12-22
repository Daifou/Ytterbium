# Supabase Database Setup Guide

## Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select your project: **ocgsabgeikikddgutthh**

## Step 2: Run the SQL Migration

1. In the left sidebar, click on **SQL Editor**
2. Click **New Query**
3. Open the file `supabase_migration.sql` from your project directory
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Ctrl+Enter)

You should see a success message indicating all tables, policies, and triggers were created.

## Step 3: Verify the Schema

1. In the left sidebar, click on **Table Editor**
2. You should see 4 new tables:
   - `profiles`
   - `sessions`
   - `tasks`
   - `fatigue_metrics`

3. Click on each table to verify the columns match the schema

## Step 4: Check Row Level Security (RLS)

1. Click on **Authentication** → **Policies**
2. Verify that RLS is enabled for all tables
3. You should see policies like:
   - "Users can view their own profile"
   - "Users can view their own sessions"
   - "Users can create their own tasks"
   - etc.

## Step 5: Test Authentication

1. Run your development server: `npm run dev`
2. Open the app in your browser
3. Try signing up with a test email
4. Check the **Authentication** → **Users** tab in Supabase
5. You should see your new user listed

## Step 6: Verify Data Flow

1. Sign in to the app
2. Enter a task and start a focus session
3. Go to **Table Editor** → **sessions** in Supabase
4. You should see a new session record
5. Check the **tasks** table for your task
6. After running for a bit, check **fatigue_metrics** for tracking data

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the entire SQL migration script
- Check that you're in the correct project

### "permission denied" error
- Verify RLS policies were created
- Check that you're signed in as an authenticated user

### Tasks/Sessions not saving
- Open browser console (F12) and check for errors
- Verify your `.env.local` file has the correct credentials
- Make sure you're signed in (check `currentUser` state)

## Environment Variables

Make sure your `.env.local` file contains:

```
VITE_SUPABASE_URL=https://ocgsabgeikikddgutthh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZ3NhYmdlaWtpa2RkZ3V0dGhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODM0NzQsImV4cCI6MjA1MDQ1OTQ3NH0.sb_publishable_I6d1kAnxR4lsoJnJBT5F9g_Rgm6Iyyc
```

Restart your dev server after adding these variables.

## Next Steps

Once the database is set up and working:
- Test the full user flow (sign up → add tasks → run session)
- Verify data persists across page refreshes
- Test on multiple devices to ensure sync works
- Consider adding real-time subscriptions for collaborative features
