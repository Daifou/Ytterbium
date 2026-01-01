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

    async updateProfile(userId: string, updates: { full_name?: string, total_reserve?: number }): Promise<boolean> {
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

    async getVaultStats(userId: string): Promise<{ barsToday: number; totalBars: number }> {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // 1. Get today's yield (1 bar per 10 minutes of completed focus sessions since midnight)
            const { data: sessionData, error: sessionError } = await supabase
                .from('sessions')
                .select('elapsed_seconds')
                .eq('user_id', userId)
                .eq('status', 'COMPLETED')
                .eq('type', 'FOCUS')
                .gte('created_at', today.toISOString());

            if (sessionError) throw sessionError;

            const totalSecondsToday = sessionData?.reduce((acc, s) => acc + (s.elapsed_seconds || 0), 0) || 0;
            const barsToday = Math.floor(totalSecondsToday / 600);

            // 2. Get total reserve from profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*') // Select all to avoid schema mismatch issues if specific field is missing
                .eq('id', userId)
                .single();

            let totalBars = 0;
            if (!profileError && profileData) {
                totalBars = (profileData as any).total_reserve || 0;
            }

            return { barsToday, totalBars };
        } catch (err) {
            console.error('Get vault stats error:', err);
            return { barsToday: 0, totalBars: 0 };
        }
    }

    async incrementTotalReserve(userId: string, amount: number = 1): Promise<boolean> {
        try {
            const stats = await this.getVaultStats(userId);
            return await this.updateProfile(userId, { total_reserve: stats.totalBars + amount });
        } catch (err) {
            console.error('Increment total reserve error:', err);
            return false;
        }
    }

    async incrementFreeSessionsUsed(userId: string): Promise<boolean> {
        try {
            // Get current count
            const { data: profile, error: getError } = await supabase
                .from('profiles')
                .select('free_sessions_used')
                .eq('id', userId)
                .single();

            if (getError) return false;

            const current = (profile as any)?.free_sessions_used || 0;

            // Increment
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
        updates: {
            elapsed_seconds?: number;
            status?: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
            fqs?: number;
            end_time?: string;
        }
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
        updates: {
            title?: string;
            completed?: boolean;
            priority?: 'low' | 'medium' | 'high';
            session_id?: string;
        }
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
            // 1. Update session
            const { error: sessionError } = await supabase
                .from('sessions')
                .update({ user_id: userId })
                .eq('id', sessionId)
                .is('user_id', null);

            if (sessionError) throw sessionError;

            // 2. Update all tasks linked to this session
            const { error: tasksError } = await supabase
                .from('tasks')
                .update({ user_id: userId })
                .eq('session_id', sessionId)
                .is('user_id', null);

            if (tasksError) throw tasksError;

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
            priority: dbTask.priority,
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
            type: dbSession.type,
            fqs: dbSession.fqs,
        };
    }
}

export const databaseService = new DatabaseService();
