import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// IMPORTANT: Create a .env.local file with your actual Supabase credentials
// See SUPABASE_SETUP.md for instructions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ocgsabgeikikddgutthh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseAnonKey) {
    console.error('VITE_SUPABASE_ANON_KEY is not set. Please create a .env.local file with your Supabase credentials.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
    },
});

// Database types for TypeScript
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
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
