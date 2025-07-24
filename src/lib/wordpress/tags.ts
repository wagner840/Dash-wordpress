/**
 * @fileoverview Serviço para gerenciamento de tags WordPress
 * @module lib/wordpress/tags
 */

import { AxiosInstance } from 'axios';
import { WordPressTag, WordPressApiError, WordPressTagSchema } from './types';

export class TagsService {
  constructor(private client: AxiosInstance) {}

  /**
   * Lista todas as tags
   */
  async getTags(params?: {
    context?: 'view' | 'embed' | 'edit';
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    offset?: number;
    order?: 'asc' | 'desc';
    orderby?: 'id' | 'include' | 'name' | 'slug' | 'include_slugs' | 'term_group' | 'description' | 'count';
    hide_empty?: boolean;
    post?: number;
    slug?: string[];
  }): Promise<WordPressTag[]> {
    try {
      const response = await this.client.get('/tags', { params });
      return response.data as WordPressTag[];
      // return response.data.map((tag: any) => WordPressTagSchema.parse(tag));
    } catch (error) {
      throw new WordPressApiError(
        'Failed to fetch tags',
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Obtém uma tag específica
   */
  async getTag(id: number): Promise<WordPressTag> {
    try {
      const response = await this.client.get(`/tags/${id}`);
      return response.data as WordPressTag;
      // return WordPressTagSchema.parse(response.data);
    } catch (error) {
      throw new WordPressApiError(
        `Failed to fetch tag ${id}`,
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Cria uma nova tag
   */
  async createTag(data: {
    name: string;
    description?: string;
    slug?: string;
    meta?: any[];
  }): Promise<WordPressTag> {
    try {
      const response = await this.client.post('/tags', data);
      return response.data as WordPressTag;
      // return WordPressTagSchema.parse(response.data);
    } catch (error) {
      throw new WordPressApiError(
        'Failed to create tag',
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Atualiza uma tag existente
   */
  async updateTag(id: number, data: {
    name?: string;
    description?: string;
    slug?: string;
    meta?: any[];
  }): Promise<WordPressTag> {
    try {
      const response = await this.client.put(`/tags/${id}`, data);
      return response.data as WordPressTag;
      // return WordPressTagSchema.parse(response.data);
    } catch (error) {
      throw new WordPressApiError(
        `Failed to update tag ${id}`,
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Exclui uma tag
   */
  async deleteTag(id: number, force: boolean = false): Promise<WordPressTag> {
    try {
      const response = await this.client.delete(`/tags/${id}`, {
        params: { force }
      });
      return response.data as WordPressTag;
    } catch (error) {
      throw new WordPressApiError(
        `Failed to delete tag ${id}`,
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}