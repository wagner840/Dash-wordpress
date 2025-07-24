/**
 * @fileoverview Tipos e configurações para WordPress API
 * @module lib/wordpress/types
 */

import { z } from 'zod';

export interface WordPressSiteConfig {
  id: string;
  baseUrl: string;
  username: string;
  password: string;
  apiPath?: string;
  timeout?: number;
  retries?: number;
}

export class WordPressApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public wpError?: any,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'WordPressApiError';
  }
}

// Validation schemas
export const WordPressPostSchema = z.object({
  id: z.number(),
  date: z.string(),
  date_gmt: z.string(),
  guid: z.object({
    rendered: z.string(),
  }),
  modified: z.string(),
  modified_gmt: z.string(),
  slug: z.string(),
  status: z.enum(['publish', 'future', 'draft', 'pending', 'private']),
  type: z.string(),
  link: z.string(),
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
  comment_status: z.enum(['open', 'closed']),
  ping_status: z.enum(['open', 'closed']),
  sticky: z.boolean(),
  template: z.string(),
  format: z.string(),
  meta: z.array(z.any()),
  categories: z.array(z.number()),
  tags: z.array(z.number()),
});

export const WordPressCategorySchema = z.object({
  id: z.number(),
  count: z.number(),
  description: z.string(),
  link: z.string(),
  name: z.string(),
  slug: z.string(),
  taxonomy: z.string(),
  parent: z.number(),
  meta: z.array(z.any()),
});

export const WordPressTagSchema = z.object({
  id: z.number(),
  count: z.number(),
  description: z.string(),
  link: z.string(),
  name: z.string(),
  slug: z.string(),
  taxonomy: z.string(),
  meta: z.array(z.any()),
});

export type WordPressPost = z.infer<typeof WordPressPostSchema>;
export type WordPressCategory = z.infer<typeof WordPressCategorySchema>;
export type WordPressTag = z.infer<typeof WordPressTagSchema>;

export interface WordPressPostsParams {
  context?: 'view' | 'embed' | 'edit';
  page?: number;
  per_page?: number;
  search?: string;
  after?: string;
  author?: number[];
  author_exclude?: number[];
  before?: string;
  exclude?: number[];
  include?: number[];
  offset?: number;
  order?: 'asc' | 'desc';
  orderby?: 'author' | 'date' | 'id' | 'include' | 'modified' | 'parent' | 'relevance' | 'slug' | 'include_slugs' | 'title';
  slug?: string[];
  status?: string[];
  categories?: number[];
  categories_exclude?: number[];
  tags?: number[];
  tags_exclude?: number[];
  sticky?: boolean;
}

export interface CreateWordPressPostData {
  title: string;
  content?: string;
  excerpt?: string;
  status?: 'publish' | 'future' | 'draft' | 'pending' | 'private';
  author?: number;
  featured_media?: number;
  comment_status?: 'open' | 'closed';
  ping_status?: 'open' | 'closed';
  format?: string;
  meta?: any[];
  sticky?: boolean;
  template?: string;
  categories?: number[];
  tags?: number[];
  slug?: string;
  password?: string;
}

export interface UpdateWordPressPostData extends Partial<CreateWordPressPostData> {
  id: number;
}

export interface WordPressStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalTags: number;
  totalComments?: number;
}