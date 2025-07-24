/**
 * @fileoverview Serviço para gerenciamento de posts WordPress
 * @module lib/wordpress/posts
 */

import { AxiosInstance } from 'axios';
import { 
  WordPressPost, 
  WordPressPostsParams, 
  CreateWordPressPostData, 
  UpdateWordPressPostData,
  WordPressApiError,
  WordPressPostSchema
} from './types';

export class PostsService {
  constructor(private client: AxiosInstance) {}

  /**
   * Lista posts com filtros opcionais
   */
  async getPosts(params?: WordPressPostsParams): Promise<WordPressPost[]> {
    try {
      const response = await this.client.get('/posts', { params });
      const posts = response.data;
      
      // Desabilitar validação temporariamente para debugging
      return posts as WordPressPost[];
      // return posts.map((post: any) => WordPressPostSchema.parse(post));
    } catch (error) {
      throw new WordPressApiError(
        'Failed to fetch posts',
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Obtém um post específico
   */
  async getPost(id: number, context: 'view' | 'embed' | 'edit' = 'view'): Promise<WordPressPost> {
    try {
      const response = await this.client.get(`/posts/${id}`, {
        params: { context }
      });
      return response.data as WordPressPost;
      // return WordPressPostSchema.parse(response.data);
    } catch (error) {
      throw new WordPressApiError(
        `Failed to fetch post ${id}`,
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Cria um novo post
   */
  async createPost(data: CreateWordPressPostData): Promise<WordPressPost> {
    try {
      const response = await this.client.post('/posts', data);
      return response.data as WordPressPost;
      // return WordPressPostSchema.parse(response.data);
    } catch (error) {
      throw new WordPressApiError(
        'Failed to create post',
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Atualiza um post existente
   */
  async updatePost(data: UpdateWordPressPostData): Promise<WordPressPost> {
    try {
      const { id, ...updateData } = data;
      const response = await this.client.put(`/posts/${id}`, updateData);
      return response.data as WordPressPost;
      // return WordPressPostSchema.parse(response.data);
    } catch (error) {
      throw new WordPressApiError(
        `Failed to update post ${data.id}`,
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Exclui um post
   */
  async deletePost(id: number, force: boolean = false): Promise<WordPressPost> {
    try {
      const response = await this.client.delete(`/posts/${id}`, {
        params: { force }
      });
      return response.data as WordPressPost;
    } catch (error) {
      throw new WordPressApiError(
        `Failed to delete post ${id}`,
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Atualiza status de um post
   */
  async updatePostStatus(id: number, status: 'publish' | 'draft' | 'pending' | 'private'): Promise<WordPressPost> {
    return this.updatePost({ id, status });
  }

  /**
   * Busca posts por termo
   */
  async searchPosts(search: string, limit: number = 20): Promise<WordPressPost[]> {
    return this.getPosts({ search, per_page: limit });
  }

  /**
   * Obtém posts por categoria
   */
  async getPostsByCategory(categoryId: number, limit: number = 20): Promise<WordPressPost[]> {
    return this.getPosts({ categories: [categoryId], per_page: limit });
  }

  /**
   * Obtém posts por tag
   */
  async getPostsByTag(tagId: number, limit: number = 20): Promise<WordPressPost[]> {
    return this.getPosts({ tags: [tagId], per_page: limit });
  }

  /**
   * Obtém posts por autor
   */
  async getPostsByAuthor(authorId: number, limit: number = 20): Promise<WordPressPost[]> {
    return this.getPosts({ author: [authorId], per_page: limit });
  }

  /**
   * Obtém posts por status
   */
  async getPostsByStatus(status: string[], limit: number = 20): Promise<WordPressPost[]> {
    return this.getPosts({ status, per_page: limit });
  }
}