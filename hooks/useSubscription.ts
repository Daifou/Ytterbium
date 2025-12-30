import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

import { PostgrestError } from '@supabase/supabase-js';

export interface Subscription {
    id: string;
    status: 'active' | 'canceled' | 'incomplete' | 'revoked';
    product_name: string;
    current_period_end: string;
    is_recurring: boolean;
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

                // We query the helper view we created in the SQL migration
                const { data, error } = await supabase
                    .from('user_subscriptions')
                    .select('*')
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 is 'No rows found'
                    setError(error);
                } else {
                    setSubscription(data as Subscription);
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

        // Subscribe to changes for Real-time Resilience
        const subscriptionChannel = supabase
            .channel('polar_sync_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'polar_subscriptions' },
                () => fetchSubscription()
            )
            .subscribe();

        return () => {
            if (authSubscription) authSubscription.unsubscribe();
            supabase.removeChannel(subscriptionChannel);
        };
    }, []);


    return {
        subscription,
        loading,
        error,
        isPremium: subscription?.status === 'active'
    };
}
