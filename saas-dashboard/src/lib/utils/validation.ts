/**
 * @fileoverview Utilitários para validação de dados
 * @module lib/utils/validation
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate WordPress URL format
 */
export function isValidWordPressUrl(url: string): boolean {
  if (!isValidUrl(url)) return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Validate if string is not empty
 */
export function isNotEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Deve ter pelo menos 8 caracteres');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Deve conter letras minúsculas');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Deve conter letras maiúsculas');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Deve conter números');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Deve conter caracteres especiais');
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  };
}

/**
 * Sanitize HTML input
 */
export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

/**
 * Validate WordPress API key format
 */
export function isValidWordPressApiKey(apiKey: string): boolean {
  // WordPress app passwords são geralmente 24 caracteres com espaços
  const cleanKey = apiKey.replace(/\s/g, '');
  return cleanKey.length >= 20 && /^[a-zA-Z0-9]+$/.test(cleanKey);
}

/**
 * Validate blog domain format
 */
export function isValidBlogDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
}

/**
 * Validate keyword format
 */
export function isValidKeyword(keyword: string): boolean {
  return keyword.trim().length > 0 && keyword.length <= 200;
}

/**
 * Validate numeric range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}