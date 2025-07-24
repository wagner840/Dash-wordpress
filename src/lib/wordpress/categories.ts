/**
 * @fileoverview Serviço para gerenciamento de categorias WordPress
 * @module lib/wordpress/categories
 */

import { AxiosInstance } from 'axios';
import { WordPressCategory, WordPressApiError, WordPressCategorySchema } from './types';

export class CategoriesService {
  constructor(private client: AxiosInstance) {}

  /**
   * Lista todas as categorias
   */
  async getCategories(params?: {
    context?: 'view' | 'embed' | 'edit';
    page?: number;
    per_page?: number;
    search?: string;
    exclude?: number[];
    include?: number[];
    order?: 'asc' | 'desc';
    orderby?: 'id' | 'include' | 'name' | 'slug' | 'include_slugs' | 'term_group' | 'description' | 'count';
    hide_empty?: boolean;
    parent?: number;
    post?: number;
    slug?: string[];
  }): Promise<WordPressCategory[]> {
    try {
      const response = await this.client.get('/categories', { params });
      return response.data as WordPressCategory[];
      // return response.data.map((category: any) => WordPressCategorySchema.parse(category));
    } catch (error) {
      throw new WordPressApiError(
        'Failed to fetch categories',
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Obtém uma categoria específica
   */
  async getCategory(id: number): Promise<WordPressCategory> {
    try {
      const response = await this.client.get(`/categories/${id}`);
      return response.data as WordPressCategory;
      // return WordPressCategorySchema.parse(response.data);
    } catch (error) {
      throw new WordPressApiError(
        `Failed to fetch category ${id}`,
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Cria uma nova categoria
   */
  async createCategory(data: {
    name: string;
    description?: string;
    slug?: string;
    parent?: number;
    meta?: any[];
  }): Promise<WordPressCategory> {
    try {
      const response = await this.client.post('/categories', data);
      return response.data as WordPressCategory;
      // return WordPressCategorySchema.parse(response.data);
    } catch (error) {
      throw new WordPressApiError(
        'Failed to create category',
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Atualiza uma categoria existente
   */
  async updateCategory(id: number, data: {
    name?: string;
    description?: string;
    slug?: string;
    parent?: number;
    meta?: any[];
  }): Promise<WordPressCategory> {
    try {
      const response = await this.client.put(`/categories/${id}`, data);
      return response.data as WordPressCategory;
      // return WordPressCategorySchema.parse(response.data);
    } catch (error) {
      throw new WordPressApiError(
        `Failed to update category ${id}`,
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Exclui uma categoria
   */
  async deleteCategory(id: number, force: boolean = false): Promise<WordPressCategory> {
    try {
      const response = await this.client.delete(`/categories/${id}`, {
        params: { force }
      });
      return response.data as WordPressCategory;
    } catch (error) {
      throw new WordPressApiError(
        `Failed to delete category ${id}`,
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }
}