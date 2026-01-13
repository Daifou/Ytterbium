import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Middleware function to check if a user has an active subscription.
 * This can be used in server-side logic or as a guard in API routes.
 */
export async function checkSubscription(userId: string) {
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('subscription_status, is_premium, current_period_end')
            .eq('id', userId)
            .single();

        if (error || !profile) {
            return {
                isPremium: false,
                status: 'free',
                error: error?.message || 'Profile not found'
            };
        }

        const now = new Date();
        const periodEnd = profile.current_period_end ? new Date(profile.current_period_end) : null;

        // Robust check: Status must be active AND (either no end date or end date is in future)
        const isActive = profile.subscription_status === 'active' &&
            (periodEnd === null || periodEnd > now);

        return {
            isPremium: isActive || profile.is_premium, // Fallback to is_premium legacy flag
            status: profile.subscription_status,
            periodEnd: profile.current_period_end
        };
    } catch (err) {
        console.error('checkSubscription error:', err);
        return { isPremium: false, status: 'error' };
    }
}
