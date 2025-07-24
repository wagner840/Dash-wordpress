/**
 * @fileoverview Utilitários para formatação de dados
 * @module lib/utils/format
 */

/**
 * Format numbers with proper localization and units.
 */
export function formatNumber(
  value: number,
  locale: string = 'pt-BR',
  options: Intl.NumberFormatOptions = {}
): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0';
  }

  const defaultOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: 2,
    ...options
  };

  return new Intl.NumberFormat(locale, defaultOptions).format(value);
}

/**
 * Format currency values
 */
export function formatCurrency(
  value: number,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string {
  return formatNumber(value, locale, {
    style: 'currency',
    currency,
  });
}

/**
 * Format percentage values
 */
export function formatPercentage(
  value: number,
  locale: string = 'pt-BR',
  decimals: number = 1
): string {
  return formatNumber(value / 100, locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format large numbers with units (K, M, B)
 */
export function formatCompactNumber(
  value: number,
  locale: string = 'pt-BR'
): string {
  return formatNumber(value, locale, {
    notation: 'compact',
    compactDisplay: 'short',
  });
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = '...'
): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Convert string to slug format
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Format HTML content to plain text
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/**
 * Generate initials from name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxLength)
    .join('');
}