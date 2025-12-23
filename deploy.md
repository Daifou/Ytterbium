# Deployment Guide: Ytterbium

Your app is built with Vite and is ready for high-performance hosting. Here is how to get it live.

## 1. Environment Variables
Ensure the following variables are set in your hosting provider's dashboard:
- `VITE_SUPABASE_URL`: `https://ocgsabgeikikddgutthh.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: (Your project's secret anonymous key)

## 2. Recommended Hosting (Vercel)
Vercel is the most seamless for Vite projects:
1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel will auto-detect the Vite framework.
4. Add the environment variables above.
5. Click **Deploy**.

## 3. Supabase Production Settings
Before going live, ensure you have:
1. Applied `supabase_migration.sql` for the initial schema.
2. Applied `ghost_migration.sql` for the anonymous session logic.
3. Updated the **Auth Redirect URL** in the Supabase dashboard (`Authentication > URL Configuration`) to your new production domain.

## 4. Final Verification
Once hosted, verify:
- [ ] Users can enter as a "Ghost" without seeing branding.
- [ ] AI classification works on the landing page.
- [ ] The "Auth Wall" appears when pausing or during fatigue detection.
- [ ] Data correctly syncs to Supabase.
