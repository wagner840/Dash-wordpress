/**
 * @fileoverview Supabase client configuration and utilities
 * @module lib/supabase
 */

import { createClient } from '@supabase/supabase-js';

// Environment variables validation
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

/**
 * Supabase client instance for the WordPress SaaS Dashboard.
 * 
 * Configured with proper authentication and real-time capabilities.
 * Used for authentication, database operations, and real-time subscriptions.
 * 
 * @example
 * ```typescript
 * import { supabase } from '@/lib/supabase';
 * 
 * // Authentication
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password'
 * });
 * 
 * // Database query
 * const { data: blogs } = await supabase
 *   .from('blogs')
 *   .select('*')
 *   .eq('is_active', true);
 * ```
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage
    storage: window.localStorage,
    // Auto refresh token before expiry
    autoRefreshToken: true,
    // Persist user session across browser sessions
    persistSession: true,
    // Detect session from URL (for magic links, OAuth redirects)
    detectSessionInUrl: true,
  },
  realtime: {
    // Enable real-time subscriptions
    params: {
      eventsPerSecond: 10,
    },
  },
});

/**
 * Helper function to handle Supabase errors consistently.
 * 
 * Provides structured error handling for all Supabase operations
 * with proper TypeScript typing and user-friendly error messages.
 * 
 * @param error - The Supabase error object
 * @param context - Additional context about where the error occurred
 * @throws {SupabaseError} Formatted error with context
 * 
 * @example
 * ```typescript
 * try {
 *   const { data, error } = await supabase.from('blogs').select('*');
 *   if (error) handleSupabaseError(error, 'fetching blogs');
 *   return data;
 * } catch (err) {
 *   console.error('Blog fetch failed:', err.message);
 * }
 * ```
 */
export function handleSupabaseError(error: any, context: string): never {
  const message = error?.message || 'An unknown error occurred';
  const code = error?.code || 'UNKNOWN_ERROR';
  
  throw new SupabaseError(`${context}: ${message}`, code, error);
}

/**
 * Custom error class for Supabase-related errors.
 * 
 * Provides structured error handling with proper context and error codes
 * for consistent error handling across the application.
 */
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'SupabaseError';
  }
}