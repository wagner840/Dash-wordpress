/**
 * @fileoverview Utilitários para estilos e CSS
 * @module lib/utils/styles
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine and merge CSS class names using clsx and Tailwind merge.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Gera classes para cores baseadas em status
 */
export function getStatusColor(status: string): string {
  const colors = {
    'success': 'bg-green-100 text-green-800',
    'error': 'bg-red-100 text-red-800',
    'warning': 'bg-yellow-100 text-yellow-800',
    'info': 'bg-blue-100 text-blue-800',
    'pending': 'bg-gray-100 text-gray-800',
    'completed': 'bg-green-100 text-green-800',
    'in_progress': 'bg-blue-100 text-blue-800',
    'publish': 'bg-green-100 text-green-800',
    'draft': 'bg-yellow-100 text-yellow-800',
    'private': 'bg-blue-100 text-blue-800',
    'future': 'bg-purple-100 text-purple-800',
    'trash': 'bg-red-100 text-red-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

/**
 * Gera classes para dificuldade de keywords
 */
export function getDifficultyColor(difficulty: number): string {
  if (difficulty < 30) return 'bg-green-100 text-green-800';
  if (difficulty < 70) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

/**
 * Gera classes responsivas para grid
 */
export function getGridColumns(count: number): string {
  const columns = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };
  return columns[Math.min(count, 6) as keyof typeof columns] || 'grid-cols-1';
}