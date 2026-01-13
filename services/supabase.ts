import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// IMPORTANT: Create a .env.local file with your actual Supabase credentials
// See SUPABASE_SETUP.md for instructions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ocgsabgeikikddgutthh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
    console.error('VITE_SUPABASE_ANON_KEY is not set. Please create a .env.local file with your Supabase credentials.');
}

// Create Supabase client or fallback
let client;

if (supabaseUrl && supabaseAnonKey) {
    client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: window.localStorage,
        },
    });
} else {
    console.warn('Supabase credentials missing. App running in offline/mock mode.');
    // Mock client to prevent crash on load
    client = {
        auth: {
            getUser: async () => ({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            getSession: async () => ({ data: { session: null }, error: null }),
            signOut: async () => ({ error: null }),
            signInWithOAuth: async (options: any) => {
                console.warn('Supabase Mock: signInWithOAuth called with', options);
                alert('Supabase is in Mock Mode. Google Sign-In is disabled. Please check your .env.local file.');
                return { error: null };
            },
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: async () => ({ data: null, error: null }),
                    maybeSingle: async () => ({ data: null, error: null })
                })
            }),
            update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
            insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        }),
        channel: () => ({ on: () => ({ subscribe: () => { } }) }),
        removeChannel: () => { },
    } as any;
}

export const supabase = client;

/**
 * Get the base URL for redirects, prioritizing environment variable for production.
 * This ensures users stay on ytterbium.life instead of falling back to Vercel URLs.
 */
export const getRedirectUrl = (): string => {
    const siteUrl = import.meta.env.VITE_SITE_URL;
    if (siteUrl && siteUrl.startsWith('http')) {
        return siteUrl.replace(/\/$/, ''); // Remove trailing slash if present
    }
    return window.location.origin;
};

// Database types for TypeScript
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    subscription_status: string;
                    plan_type: string | null;
                    current_period_end: string | null;
                    is_premium: boolean;
                    total_reserve: number;
                    free_sessions_used: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    subscription_status?: string;
                    plan_type?: string | null;
                    current_period_end?: string | null;
                    is_premium?: boolean;
                    total_reserve?: number;
                    free_sessions_used?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    subscription_status?: string;
                    plan_type?: string | null;
                    current_period_end?: string | null;
                    is_premium?: boolean;
                    total_reserve?: number;
                    free_sessions_used?: number;
                    updated_at?: string;
                };
            };
            sessions: {
                Row: {
                    id: string;
                    user_id: string | null;
                    start_time: string;
                    end_time: string | null;
                    duration_seconds: number;
                    elapsed_seconds: number;
                    type: 'FOCUS' | 'RELAX';
                    focus_intensity: number;
                    fqs: number;
                    status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string | null;
                    start_time?: string;
                    end_time?: string | null;
                    duration_seconds: number;
                    elapsed_seconds: number;
                    type: 'FOCUS' | 'RELAX';
                    focus_intensity: number;
                    fqs: number;
                    status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
                    created_at?: string;
                };
                Update: {
                    end_time?: string | null;
                    elapsed_seconds?: number;
                    fqs?: number;
                    status?: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
                };
            };
            tasks: {
                Row: {
                    id: string;
                    user_id: string | null;
                    session_id: string | null;
                    title: string;
                    completed: boolean;
                    priority: 'low' | 'medium' | 'high';
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string | null;
                    session_id?: string | null;
                    title: string;
                    completed?: boolean;
                    priority?: 'low' | 'medium' | 'high';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    title?: string;
                    completed?: boolean;
                    priority?: 'low' | 'medium' | 'high';
                    session_id?: string | null;
                    updated_at?: string;
                };
            };
            fatigue_metrics: {
                Row: {
                    id: string;
                    session_id: string;
                    timestamp: number;
                    keystroke_latency_ms: number;
                    typing_speed_wpm: number;
                    mouse_distance_px: number;
                    mouse_velocity_px_per_sec: number;
                    erratic_mouse_movement: boolean;
                    fatigue_score: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    session_id: string;
                    timestamp: number;
                    keystroke_latency_ms: number;
                    typing_speed_wpm: number;
                    mouse_distance_px: number;
                    mouse_velocity_px_per_sec: number;
                    erratic_mouse_movement: boolean;
                    fatigue_score: number;
                    created_at?: string;
                };
            };
        };
    };
}
