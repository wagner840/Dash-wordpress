/**
 * @fileoverview TypeScript types for Supabase database schema
 * @module types/supabase
 */

import { z } from 'zod';

/**
 * Blog entity representing a WordPress blog in the system.
 * 
 * Represents individual WordPress sites (Optmil, Einsof7) that are managed
 * through the dashboard. Contains configuration and metadata for each blog.
 */
export interface Blog {
  id: string;
  name: string;
  domain: string;
  niche: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Content post entity for managing WordPress content.
 * 
 * Represents posts that are created/managed through the dashboard
 * and synchronized with WordPress sites. Includes SEO data and performance metrics.
 */
export interface ContentPost {
  id: string;
  blog_id: string;
  title: string;
  content: string;
  status: 'draft' | 'published' | 'scheduled';
  wordpress_post_id?: number;
  seo_data: Record<string, unknown>;
  performance_metrics: Record<string, unknown>;
  created_at: string;
  published_at?: string;
}

/**
 * Production pipeline entity for workflow management.
 * 
 * Represents automated content generation workflows.
 * Tracks workflow status, success rates, and configuration details.
 */
export interface ProductionPipeline {
  id: string;
  blog_id: string;
  workflow_name: string;
  workflow_id: string;
  status: 'active' | 'paused' | 'error';
  last_execution: string;
  success_rate: number;
  configuration: Record<string, unknown>;
}

/**
 * User profile with role-based access control.
 * 
 * Extends Supabase Auth user with additional profile information
 * and role-based permissions for the dashboard.
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'admin' | 'editor' | 'viewer';
  created_at: string;
  updated_at: string;
}

// Zod validation schemas for runtime type checking

/**
 * Zod schema for Blog entity validation.
 * 
 * Ensures all blog data from external sources (API, database)
 * matches the expected structure before use in components.
 */
export const BlogSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Blog name is required'),
  domain: z.string().url('Must be a valid URL'),
  niche: z.string().min(1, 'Niche is required'),
  description: z.string(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * Zod schema for ContentPost entity validation.
 * 
 * Validates post data with proper status enum and optional fields.
 * Used when creating/updating posts through the API.
 */
export const ContentPostSchema = z.object({
  id: z.string().uuid(),
  blog_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published', 'scheduled']),
  wordpress_post_id: z.number().optional(),
  seo_data: z.record(z.unknown()),
  performance_metrics: z.record(z.unknown()),
  created_at: z.string().datetime(),
  published_at: z.string().datetime().optional(),
});

/**
 * Zod schema for ProductionPipeline entity validation.
 * 
 * Validates workflow data including status and success rate constraints.
 * Ensures success_rate is between 0 and 1 (percentage as decimal).
 */
export const ProductionPipelineSchema = z.object({
  id: z.string().uuid(),
  blog_id: z.string().uuid(),
  workflow_name: z.string().min(1, 'Workflow name is required'),
  workflow_id: z.string().min(1, 'Workflow ID is required'),
  status: z.enum(['active', 'paused', 'error']),
  last_execution: z.string().datetime(),
  success_rate: z.number().min(0).max(1),
  configuration: z.record(z.unknown()),
});

/**
 * Zod schema for UserProfile entity validation.
 * 
 * Validates user profile data with role-based access control.
 * Ensures proper email format and required fields.
 */
export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().optional(),
  avatar_url: z.string().url().optional(),
  role: z.enum(['admin', 'editor', 'viewer']),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Type inference from Zod schemas (recommended approach)
export type ValidatedBlog = z.infer<typeof BlogSchema>;
export type ValidatedContentPost = z.infer<typeof ContentPostSchema>;
export type ValidatedProductionPipeline = z.infer<typeof ProductionPipelineSchema>;
export type ValidatedUserProfile = z.infer<typeof UserProfileSchema>;

/**
 * Database table names for type-safe queries.
 * 
 * Centralized table name constants to prevent typos in queries
 * and provide better IDE support with autocompletion.
 */
export const TABLES = {
  BLOGS: 'blogs',
  CONTENT_POSTS: 'content_posts',
  PRODUCTION_PIPELINE: 'production_pipeline',
  USER_PROFILES: 'user_profiles',
  KEYWORD_OPPORTUNITIES: 'keyword_opportunities',
} as const;

export type TableName = typeof TABLES[keyof typeof TABLES];