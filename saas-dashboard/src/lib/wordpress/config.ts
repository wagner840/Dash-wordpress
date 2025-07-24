/**
 * @fileoverview Configurações para clientes WordPress
 * @module lib/wordpress/config
 */

import { WordPressSiteConfig } from './types';

/**
 * Configurações dos sites WordPress
 */
const WORDPRESS_CONFIGS: Record<string, WordPressSiteConfig> = {
  optmil: {
    id: 'optmil',
    baseUrl: 'https://optemil.com',
    username: import.meta.env.VITE_WORDPRESS_OPTEMIL_USERNAME || '',
    password: import.meta.env.VITE_WORDPRESS_OPTEMIL_PASSWORD || '',
    apiPath: '/wp-json/wp/v2',
    timeout: 30000,
  },
  einsof7: {
    id: 'einsof7',
    baseUrl: 'https://einsof7.com',
    username: import.meta.env.VITE_WORDPRESS_EINSOF7_USERNAME || '',
    password: import.meta.env.VITE_WORDPRESS_EINSOF7_PASSWORD || '',
    apiPath: '/wp-json/wp/v2',
    timeout: 30000,
  }
};

/**
 * Obtém configuração pelo site ID
 */
export function getWordPressConfig(siteId: string): WordPressSiteConfig {
  const config = WORDPRESS_CONFIGS[siteId];
  if (!config) {
    throw new Error(`WordPress configuration not found for site: ${siteId}`);
  }
  return config;
}

/**
 * Mapeia blogId (UUID) para siteId (string)
 */
export function getBlogSiteId(blogId: string): string {
  const blogMapping: Record<string, string> = {
    "25228f83-0b0d-47c7-926f-1ab6d7255f7b": "optmil",
    "718d1bf5-ba1a-4c86-8fa4-c13599eb4952": "einsof7"
  };
  
  const siteId = blogMapping[blogId];
  if (!siteId) {
    throw new Error(`Site ID not found for blog: ${blogId}`);
  }
  return siteId;
}

/**
 * Cria cliente WordPress baseado no blogId
 */
export function createWordPressClientFromBlogId(blogId: string) {
  const siteId = getBlogSiteId(blogId);
  const config = getWordPressConfig(siteId);
  
  // Import dinâmico para evitar dependência circular
  return import('./client').then(({ createWordPressClient }) => 
    createWordPressClient(config)
  );
}