/**
 * @fileoverview Utilitários principais - arquivo de exportação
 * @module lib/utils
 */

// Re-exportar todas as funções dos módulos especializados
export * from './styles';
export * from './date';
export * from './format';
export * from './validation';

// Manter compatibilidade com imports existentes
import { cn } from './styles';
import { formatDate } from './date';
import { formatNumber } from './format';

export { cn, formatDate, formatNumber };