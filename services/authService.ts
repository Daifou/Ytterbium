import { supabase } from './supabase';
import type { User, AuthError, Session } from '@supabase/supabase-js';

export interface AuthResponse {
    user: User | null;
    error: AuthError | null;
}

export interface AuthState {
    user: User | null;
    session: Session | null;
    loading: boolean;
}

class AuthService {
    /**
     * Sign up a new user with email and password
     */
    async signUp(email: string, password: string, fullName?: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) {
                return { user: null, error };
            }

            // Create profile entry
            if (data.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        email: data.user.email!,
                        full_name: fullName || null,
                    });

                if (profileError) {
                    console.error('Profile creation error:', profileError);
                }
            }

            return { user: data.user, error: null };
        } catch (err) {
            return { user: null, error: err as AuthError };
        }
    }

    /**
     * Sign in an existing user
     */
    async signIn(email: string, password: string): Promise<AuthResponse> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { user: null, error };
            }

            return { user: data.user, error: null };
        } catch (err) {
            return { user: null, error: err as AuthError };
        }
    }

    /**
     * Sign out the current user
     */
    async signOut(): Promise<{ error: AuthError | null }> {
        try {
            const { error } = await supabase.auth.signOut();
            return { error };
        } catch (err) {
            return { error: err as AuthError };
        }
    }

    /**
     * Get the current authenticated user from local session
     */
    async getUser(): Promise<User | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (err) {
            console.error('Get user error:', err);
            return null;
        }
    }

    /**
     * Get the current session
     */
    async getSession(): Promise<Session | null> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session;
        } catch (err) {
            console.error('Get session error:', err);
            return null;
        }
    }

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user ?? null, session);
        });

        return subscription;
    }

    /**
     * Send password reset email
     */
    async resetPassword(email: string): Promise<{ error: AuthError | null }> {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            return { error };
        } catch (err) {
            return { error: err as AuthError };
        }
    }

    /**
     * Update user password
     */
    async updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });
            return { error };
        } catch (err) {
            return { error: err as AuthError };
        }
    }

    /**
     * Sign in with Google
     */
    async signInWithGoogle(): Promise<{ error: AuthError | null }> {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}?authenticated=true`
                }
            });
            return { error };
        } catch (err) {
            return { error: err as AuthError };
        }
    }
}

export const authService = new AuthService();
