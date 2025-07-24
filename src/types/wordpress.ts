/**
 * @fileoverview TypeScript types for WordPress REST API integration
 * @module types/wordpress
 */

import { z } from 'zod';

/**
 * WordPress post entity from REST API.
 * 
 * Represents a post retrieved from WordPress REST API with all standard fields.
 * Used for displaying, editing, and managing WordPress content through the dashboard.
 */
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: WordPressPostStatus;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author: Array<{ embeddable: boolean; href: string }>;
    replies: Array<{ embeddable: boolean; href: string }>;
    'version-history': Array<{ count: number; href: string }>;
    'wp:attachment': Array<{ href: string }>;
    'wp:term': Array<{ taxonomy: string; embeddable: boolean; href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

/**
 * WordPress post status enumeration.
 * 
 * Standard WordPress post statuses for content lifecycle management.
 * Used in post creation, editing, and filtering operations.
 */
export type WordPressPostStatus = 
  | 'publish' 
  | 'future' 
  | 'draft' 
  | 'pending' 
  | 'private' 
  | 'trash' 
  | 'auto-draft' 
  | 'inherit';

/**
 * WordPress category entity from REST API.
 * 
 * Represents a post category with hierarchical structure support.
 * Used for organizing and filtering WordPress content.
 */
export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    'wp:post_type': Array<{ href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

/**
 * WordPress tag entity from REST API.
 * 
 * Represents a post tag for content labeling and organization.
 * Used for content tagging and filtering functionality.
 */
export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  meta: Record<string, unknown>;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    'wp:post_type': Array<{ href: string }>;
    curies: Array<{ name: string; href: string; templated: boolean }>;
  };
}

/**
 * WordPress media/attachment entity from REST API.
 * 
 * Represents uploaded media files (images, documents, etc.)
 * associated with posts or used in the media library.
 */
export interface WordPressMedia {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: 'inherit' | 'private' | 'trash';
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  author: number;
  comment_status: 'open' | 'closed';
  ping_status: 'open' | 'closed';
  template: string;
  meta: Record<string, unknown>;
  description: {
    rendered: string;
  };
  caption: {
    rendered: string;
  };
  alt_text: string;
  media_type: 'image' | 'video' | 'audio' | 'file';
  mime_type: string;
  media_details: {
    width?: number;
    height?: number;
    file?: string;
    sizes?: Record<string, {
      file: string;
      width: number;
      height: number;
      mime_type: string;
      source_url: string;
    }>;
  };
  post: number | null;
  source_url: string;
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    author: Array<{ embeddable: boolean; href: string }>;
    replies: Array<{ embeddable: boolean; href: string }>;
  };
}

/**
 * Parameters for WordPress posts query.
 * 
 * Used to filter, sort, and paginate WordPress posts
 * when fetching from the REST API.
 */
export interface WordPressPostsParams {
  /** Post context (view, embed, edit) */
  context?: 'view' | 'embed' | 'edit';
  /** Page number for pagination */
  page?: number;
  /** Number of posts per page */
  per_page?: number;
  /** Search term */
  search?: string;
  /** Posts published after this date */
  after?: string;
  /** Posts modified after this date */
  modified_after?: string;
  /** Author ID */
  author?: number | number[];
  /** Exclude author IDs */
  author_exclude?: number | number[];
  /** Posts published before this date */
  before?: string;
  /** Posts modified before this date */
  modified_before?: string;
  /** Exclude post IDs */
  exclude?: number | number[];
  /** Include specific post IDs */
  include?: number | number[];
  /** Offset for pagination */
  offset?: number;
  /** Sort order */
  order?: 'asc' | 'desc';
  /** Sort field */
  orderby?: 'author' | 'date' | 'id' | 'include' | 'modified' | 'parent' | 'relevance' | 'slug' | 'include_slugs' | 'title';
  /** Search within post slugs */
  slug?: string | string[];
  /** Filter by post status */
  status?: WordPressPostStatus | WordPressPostStatus[];
  /** Limit posts to specific categories */
  categories?: number | number[];
  /** Exclude posts from categories */
  categories_exclude?: number | number[];
  /** Limit posts to specific tags */
  tags?: number | number[];
  /** Exclude posts with tags */
  tags_exclude?: number | number[];
  /** Include sticky posts in results */
  sticky?: boolean;
}

/**
 * Data for creating a new WordPress post.
 * 
 * Required and optional fields when creating a new post
 * through the WordPress REST API.
 */
export interface CreateWordPressPostData {
  /** Post title */
  title: string;
  /** Post content */
  content: string;
  /** Post excerpt */
  excerpt?: string;
  /** Post status */
  status?: WordPressPostStatus;
  /** Author ID */
  author?: number;
  /** Featured media ID */
  featured_media?: number;
  /** Comment status */
  comment_status?: 'open' | 'closed';
  /** Ping status */
  ping_status?: 'open' | 'closed';
  /** Post slug */
  slug?: string;
  /** Post password for protection */
  password?: string;
  /** Category IDs */
  categories?: number[];
  /** Tag IDs */
  tags?: number[];
  /** Custom meta fields */
  meta?: Record<string, unknown>;
  /** Post template */
  template?: string;
  /** Post format */
  format?: string;
  /** Whether post is sticky */
  sticky?: boolean;
}

/**
 * Data for updating an existing WordPress post.
 * 
 * All fields are optional for updates, allowing partial updates
 * of WordPress posts through the REST API.
 */
export interface UpdateWordPressPostData extends Partial<CreateWordPressPostData> {
  /** Post ID (required for updates) */
  id: number;
}

// Zod validation schemas for runtime type checking

/**
 * Zod schema for WordPress post validation.
 * 
 * Validates WordPress post data from API responses
 * to ensure type safety and data integrity.
 */
export const WordPressPostSchema = z.object({
  id: z.number(),
  date: z.string().datetime(),
  slug: z.string(),
  status: z.enum(['publish', 'future', 'draft', 'pending', 'private', 'trash', 'auto-draft', 'inherit']),
  title: z.object({
    rendered: z.string(),
  }),
  content: z.object({
    rendered: z.string(),
    protected: z.boolean(),
  }),
  excerpt: z.object({
    rendered: z.string(),
    protected: z.boolean(),
  }),
  author: z.number(),
  featured_media: z.number(),
  categories: z.array(z.number()),
  tags: z.array(z.number()),
  _links: z.object({
    self: z.array(z.object({ href: z.string() })),
  }).passthrough(), // Allow additional _links properties
}).passthrough(); // Allow additional WordPress fields

/**
 * Zod schema for WordPress category validation.
 * 
 * Validates category data from WordPress REST API responses.
 */
export const WordPressCategorySchema = z.object({
  id: z.number(),
  count: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  parent: z.number(),
});

/**
 * Zod schema for WordPress tag validation.
 * 
 * Validates tag data from WordPress REST API responses.
 */
export const WordPressTagSchema = z.object({
  id: z.number(),
  count: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
});

/**
 * Zod schema for creating WordPress posts.
 * 
 * Validates post creation data before sending to WordPress API.
 * Ensures required fields are present and properly formatted.
 */
export const CreatePostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().optional(),
  status: z.enum(['publish', 'draft', 'pending', 'future', 'private']).default('draft'),
  categories: z.array(z.number()).optional(),
  tags: z.array(z.number()).optional(),
  featured_media: z.number().optional(),
  slug: z.string().optional(),
});

// Type inference from Zod schemas
export type ValidatedWordPressPost = z.infer<typeof WordPressPostSchema>;
export type ValidatedWordPressCategory = z.infer<typeof WordPressCategorySchema>;
export type ValidatedWordPressTag = z.infer<typeof WordPressTagSchema>;
export type ValidatedCreatePostData = z.infer<typeof CreatePostSchema>;

/**
 * WordPress site configuration.
 * 
 * Configuration object for connecting to a specific WordPress site
 * including authentication and API endpoint details.
 */
export interface WordPressSiteConfig {
  /** Site identifier (e.g., 'optmil', 'einsof7') */
  id: 'optmil' | 'einsof7';
  /** Site display name */
  name: string;
  /** Base URL of the WordPress site */
  baseUrl: string;
  /** Base64-encoded Basic Auth credentials (username:password) */
  authToken: string;
  /** WordPress REST API base path */
  apiPath?: string;
}

/**
 * WordPress API error response.
 * 
 * Standard error format returned by WordPress REST API
 * when requests fail due to validation or server errors.
 */
export interface WordPressApiError {
  /** Error code */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Additional error data */
  data?: {
    /** HTTP status code */
    status?: number;
    /** Additional error parameters */
    params?: Record<string, unknown>;
  };
}