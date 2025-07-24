/**
 * @fileoverview Arquivo de exportação principal para WordPress API
 * @module lib/wordpress
 */

export * from './types';
export * from './client';
export * from './posts';
export * from './categories';
export * from './tags';
export * from './config';

// Re-export para compatibilidade
export { WordPressClient as default } from './client';