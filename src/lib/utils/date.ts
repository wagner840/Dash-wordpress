/**
 * @fileoverview Utilitários para formatação de datas
 * @module lib/utils/date
 */

/**
 * Format a date string for display.
 */
export function formatDate(
  dateString: string,
  options: {
    includeTime?: boolean;
    locale?: string;
    timezone?: string;
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
  } = {}
): string {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Data inválida';
    }

    const {
      includeTime = false,
      locale = 'pt-BR',
      timezone = 'America/Sao_Paulo',
      dateStyle = 'medium',
      timeStyle = 'short'
    } = options;

    const formatOptions: Intl.DateTimeFormatOptions = {
      timeZone: timezone,
    };

    if (includeTime) {
      formatOptions.dateStyle = dateStyle;
      formatOptions.timeStyle = timeStyle;
    } else {
      formatOptions.dateStyle = dateStyle;
    }

    return new Intl.DateTimeFormat(locale, formatOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
}

/**
 * Calcula a diferença entre duas datas
 */
export function getDateDifference(
  startDate: string | Date,
  endDate: string | Date = new Date(),
  unit: 'days' | 'hours' | 'minutes' = 'days'
): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();

  switch (unit) {
    case 'minutes':
      return Math.floor(diffMs / (1000 * 60));
    case 'hours':
      return Math.floor(diffMs / (1000 * 60 * 60));
    case 'days':
    default:
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }
}

/**
 * Formatar duração em texto legível
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

/**
 * Verifica se uma data está no passado
 */
export function isDateInPast(dateString: string): boolean {
  return new Date(dateString) < new Date();
}

/**
 * Verifica se uma data está no futuro
 */
export function isDateInFuture(dateString: string): boolean {
  return new Date(dateString) > new Date();
}

/**
 * Obter timestamp atual
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}