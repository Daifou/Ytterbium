import { supabase } from './supabase';
import type { Database } from './supabase';
import type { Task, FatigueMetrics, SessionData } from '../types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type DbSession = Database['public']['Tables']['sessions']['Row'];
type DbTask = Database['public']['Tables']['tasks']['Row'];
type DbMetrics = Database['public']['Tables']['fatigue_metrics']['Row'];

class DatabaseService {
    // ==================== PROFILE OPERATIONS ====================

    async getProfile(userId: string): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Get profile error:', err);
            return null;
        }
    }

    async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', userId);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Update profile error:', err);
            return false;
        }
    }

    // ==================== VAULT OPERATIONS ====================

    /**
     * Optimized vault stats fetching using optimized sessions index
     */
    async getVaultStats(userId: string): Promise<{ barsToday: number; totalBars: number }> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Fetch session aggregation and profile in parallel
            const [sessionRes, profileRes] = await Promise.all([
                supabase
                    .from('sessions')
                    .select('elapsed_seconds')
                    .eq('user_id', userId)
                    .eq('status', 'COMPLETED')
                    .eq('type', 'FOCUS')
                    .gte('created_at', today.toISOString()),
                supabase
                    .from('profiles')
                    .select('total_reserve')
                    .eq('id', userId)
                    .single()
            ]);

            if (sessionRes.error) throw sessionRes.error;
            if (profileRes.error) throw profileRes.error;

            const totalSecondsToday = sessionRes.data?.reduce((acc, s) => acc + (s.elapsed_seconds || 0), 0) || 0;
            const barsToday = Math.floor(totalSecondsToday / 600);
            const totalBars = profileRes.data.total_reserve || 0;

            return { barsToday, totalBars };
        } catch (err) {
            console.error('Get vault stats error:', err);
            return { barsToday: 0, totalBars: 0 };
        }
    }

    /**
     * Atomic increment using Postgres function to avoid race conditions and N+1
     */
    async incrementTotalReserve(userId: string, amount: number = 1): Promise<boolean> {
        try {
            const { error } = await supabase.rpc('increment_reserve', {
                user_id_param: userId,
                amount_param: amount
            });
            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Increment total reserve error:', err);
            return false;
        }
    }

    async incrementFreeSessionsUsed(userId: string): Promise<boolean> {
        try {
            // Using RPC or direct update if we have a function for it. 
            // For now, keeping it simple but using a relative update concept if supported, 
            // but JS client doesn't support relative updates directly. 
            // I'll stick to the current implementation but optimized with Promise.all if needed elsewhere.
            const { data: profile, error: getError } = await supabase
                .from('profiles')
                .select('free_sessions_used')
                .eq('id', userId)
                .single();

            if (getError) return false;

            const current = (profile as any)?.free_sessions_used || 0;

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ free_sessions_used: current + 1 })
                .eq('id', userId);

            return !updateError;
        } catch (err) {
            console.error('Increment free sessions error:', err);
            return false;
        }
    }

    // ==================== SESSION OPERATIONS ====================

    async createSession(
        userId: string | null,
        sessionData: {
            duration_seconds: number;
            type: 'FOCUS' | 'RELAX';
            focus_intensity: number;
        }
    ): Promise<string | null> {
        try {
            const { data, error } = await supabase
                .from('sessions')
                .insert({
                    user_id: userId,
                    duration_seconds: sessionData.duration_seconds,
                    elapsed_seconds: 0,
                    type: sessionData.type,
                    focus_intensity: sessionData.focus_intensity,
                    fqs: 0,
                    status: 'IDLE',
                    start_time: new Date().toISOString(),
                })
                .select('id')
                .single();

            if (error) throw error;
            return data.id;
        } catch (err) {
            console.error('Create session error:', err);
            return null;
        }
    }

    async updateSession(
        sessionId: string,
        updates: Partial<DbSession>
    ): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('sessions')
                .update(updates)
                .eq('id', sessionId);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Update session error:', err);
            return false;
        }
    }

    async getSessionHistory(userId: string, limit: number = 50): Promise<DbSession[]> {
        try {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Get session history error:', err);
            return [];
        }
    }

    async getCurrentSession(userId: string): Promise<DbSession | null> {
        try {
            const { data, error } = await supabase
                .from('sessions')
                .select('*')
                .eq('user_id', userId)
                .in('status', ['RUNNING', 'PAUSED'])
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
            return data;
        } catch (err) {
            console.error('Get current session error:', err);
            return null;
        }
    }

    // ==================== TASK OPERATIONS ====================

    async createTask(
        userId: string | null,
        task: {
            title: string;
            priority?: 'low' | 'medium' | 'high';
            session_id?: string;
        }
    ): Promise<DbTask | null> {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .insert({
                    user_id: userId,
                    title: task.title,
                    priority: task.priority || 'medium',
                    session_id: task.session_id || null,
                    completed: false,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Create task error:', err);
            return null;
        }
    }

    async updateTask(
        taskId: string,
        updates: Partial<DbTask>
    ): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('tasks')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', taskId);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Update task error:', err);
            return false;
        }
    }

    async deleteTask(taskId: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', taskId);

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Delete task error:', err);
            return false;
        }
    }

    /**
     * Optimized task fetching using composite index (user_id, completed)
     */
    async getTasks(userId: string, includeCompleted: boolean = true): Promise<DbTask[]> {
        try {
            let query = supabase
                .from('tasks')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (!includeCompleted) {
                query = query.eq('completed', false);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Get tasks error:', err);
            return [];
        }
    }

    /**
     * Subscribe to real-time task updates for a user
     */
    subscribeToTasks(userId: string, callback: (payload: any) => void) {
        return supabase
            .channel(`tasks:user_id=eq.${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'tasks',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => callback(payload)
            )
            .subscribe();
    }

    /**
     * "Claim" an anonymous session and its tasks for a newly authenticated user
     */
    async claimGhostData(userId: string, sessionId: string): Promise<boolean> {
        try {
            // Using parallel updates
            const [sessionRes, tasksRes] = await Promise.all([
                supabase
                    .from('sessions')
                    .update({ user_id: userId })
                    .eq('id', sessionId)
                    .is('user_id', null),
                supabase
                    .from('tasks')
                    .update({ user_id: userId })
                    .eq('session_id', sessionId)
                    .is('user_id', null)
            ]);

            if (sessionRes.error) throw sessionRes.error;
            if (tasksRes.error) throw tasksRes.error;

            return true;
        } catch (err) {
            console.error('Claim ghost data error:', err);
            return false;
        }
    }

    // ==================== METRICS OPERATIONS ====================

    async saveMetrics(sessionId: string, metrics: FatigueMetrics): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('fatigue_metrics')
                .insert({
                    session_id: sessionId,
                    timestamp: metrics.timestamp,
                    keystroke_latency_ms: metrics.keystrokeLatencyMs,
                    typing_speed_wpm: metrics.typingSpeedWpm,
                    mouse_distance_px: metrics.mouseDistancePx,
                    mouse_velocity_px_per_sec: metrics.mouseVelocityPxPerSec,
                    erratic_mouse_movement: metrics.erraticMouseMovement,
                    fatigue_score: metrics.fatigueScore,
                });

            if (error) throw error;
            return true;
        } catch (err) {
            console.error('Save metrics error:', err);
            return false;
        }
    }

    async getSessionMetrics(sessionId: string): Promise<DbMetrics[]> {
        try {
            const { data, error } = await supabase
                .from('fatigue_metrics')
                .select('*')
                .eq('session_id', sessionId)
                .order('timestamp', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Get session metrics error:', err);
            return [];
        }
    }

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Convert database task to app task format
     */
    dbTaskToTask(dbTask: DbTask): Task {
        return {
            id: dbTask.id,
            title: dbTask.title,
            completed: dbTask.completed,
            priority: dbTask.priority as any,
        };
    }

    /**
     * Convert database session to app session format
     */
    dbSessionToSession(dbSession: DbSession): SessionData {
        return {
            id: dbSession.id,
            startTime: new Date(dbSession.start_time).getTime(),
            endTime: dbSession.end_time ? new Date(dbSession.end_time).getTime() : undefined,
            durationSeconds: dbSession.duration_seconds,
            elapsedSeconds: dbSession.elapsed_seconds,
            type: dbSession.type as any,
            fqs: dbSession.fqs,
        };
    }
}

export const databaseService = new DatabaseService();
