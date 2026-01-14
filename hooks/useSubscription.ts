import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface Subscription {
    id: string;
    status: 'active' | 'free' | 'expired' | 'refunded';
    plan_type: string | null;
    current_period_end: string | null;
    is_premium: boolean;
}

export function useSubscription() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<PostgrestError | null>(null);

    useEffect(() => {
        let authSubscription: any;

        async function fetchSubscription() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setSubscription(null);
                    setLoading(false);
                    return;
                }

                // Query profiles table directly for Whop data
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, subscription_status, plan_type, current_period_end, is_premium')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    if (error.code !== 'PGRST116') {
                        setError(error);
                    }
                } else {
                    setSubscription({
                        id: data.id,
                        status: data.subscription_status as any,
                        plan_type: data.plan_type,
                        current_period_end: data.current_period_end,
                        is_premium: data.is_premium
                    });
                }
            } catch (err: any) {
                console.error("Subscription fetch failed:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchSubscription();

        // Listen for auth state changes to re-fetch
        const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(() => {
            fetchSubscription();
        });
        authSubscription = authListener;

        // Subscribe to changes on profiles table for Real-time Whop Sync
        const subscriptionChannel = supabase
            .channel('profile_subscription_changes')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles' },
                (payload) => {
                    console.log("[useSubscription] Profile update detected", payload.new);
                    const updated = payload.new;
                    setSubscription({
                        id: updated.id,
                        status: updated.subscription_status,
                        plan_type: updated.plan_type,
                        current_period_end: updated.current_period_end,
                        is_premium: updated.is_premium
                    });
                }
            )
            .subscribe();

        return () => {
            if (authSubscription) authSubscription.unsubscribe();
            supabase.removeChannel(subscriptionChannel);
        };
    }, []);

    const checkSubscription = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return null;

            const { data, error } = await supabase
                .from('profiles')
                .select('id, subscription_status, plan_type, current_period_end, is_premium')
                .eq('id', user.id)
                .single();

            if (error || !data) {
                return null;
            }

            const subData = {
                id: data.id,
                status: data.subscription_status as any,
                plan_type: data.plan_type,
                current_period_end: data.current_period_end,
                is_premium: data.is_premium
            };
            setSubscription(subData);
            return subData;
        } catch (err) {
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        subscription,
        loading,
        error,
        isPremium: subscription?.is_premium || false,
        checkSubscription
    };
}
