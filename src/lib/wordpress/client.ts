/**
 * @fileoverview Cliente principal para WordPress API
 * @module lib/wordpress/client
 */

import axios, { AxiosInstance } from 'axios';
import { WordPressSiteConfig, WordPressApiError } from './types';
import { PostsService } from './posts';
import { CategoriesService } from './categories';
import { TagsService } from './tags';

export class WordPressClient {
  private client: AxiosInstance;
  public posts: PostsService;
  public categories: CategoriesService;
  public tags: TagsService;

  constructor(private config: WordPressSiteConfig) {
    const baseURL = `${config.baseUrl.replace(/\/$/, '')}${config.apiPath || '/wp-json/wp/v2'}`;
    
    this.client = axios.create({
      baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      auth: {
        username: config.username,
        password: config.password,
      },
    });

    // Interceptadores de resposta para tratamento de erros
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const statusCode = error.response?.status;
        const errorData = error.response?.data;
        
        let message = 'WordPress API Error';
        if (errorData?.message) {
          message = errorData.message;
        } else if (errorData?.code) {
          message = `${errorData.code}: ${errorData.message || 'Unknown error'}`;
        } else if (error.message) {
          message = error.message;
        }

        throw new WordPressApiError(message, statusCode, errorData, error);
      }
    );

    // Inicializar serviços
    this.posts = new PostsService(this.client);
    this.categories = new CategoriesService(this.client);
    this.tags = new TagsService(this.client);
  }

  /**
   * Testa a conectividade com a API WordPress
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await this.client.get('/posts?per_page=1');
      return response.status === 200;
    } catch (error) {
      throw new WordPressApiError(
        'Failed to connect to WordPress API',
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Obtém informações sobre o site WordPress
   */
  async getSiteInfo(): Promise<any> {
    try {
      const response = await this.client.get('/');
      return response.data;
    } catch (error) {
      throw new WordPressApiError(
        'Failed to get WordPress site info',
        error instanceof WordPressApiError ? error.statusCode : undefined,
        undefined,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Obtém configuração do cliente
   */
  getConfig(): WordPressSiteConfig {
    return { ...this.config };
  }
}

// Instâncias para múltiplos sites
const wordpressClients = new Map<string, WordPressClient>();

export function createWordPressClient(config: WordPressSiteConfig): WordPressClient {
  if (!wordpressClients.has(config.id)) {
    wordpressClients.set(config.id, new WordPressClient(config));
  }
  return wordpressClients.get(config.id)!;
}

export function getWordPressClient(siteId: string): WordPressClient | null {
  return wordpressClients.get(siteId) || null;
}

export function removeWordPressClient(siteId: string): boolean {
  return wordpressClients.delete(siteId);
}