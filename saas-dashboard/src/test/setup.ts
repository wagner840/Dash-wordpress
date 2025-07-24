/**
 * @fileoverview Test setup configuration for WordPress SaaS Dashboard
 * @module test/setup
 */

import '@testing-library/jest-dom';

// Mock environment variables for testing
Object.defineProperty(import.meta, 'env', {
  value: {
    MODE: 'test',
    DEV: false,
    VITE_SUPABASE_URL: 'http://localhost:54321',
    VITE_SUPABASE_ANON_KEY: 'test-anon-key',
    VITE_SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    VITE_WORDPRESS_OPTEMIL_URL: 'http://localhost:8080',
    VITE_WORDPRESS_OPTEMIL_USERNAME: 'test-user',
    VITE_WORDPRESS_OPTEMIL_PASSWORD: 'test-password',
    VITE_WORDPRESS_EINSOF7_URL: 'http://localhost:8081',
    VITE_WORDPRESS_EINSOF7_USERNAME: 'test-user',
    VITE_WORDPRESS_EINSOF7_PASSWORD: 'test-password',
  },
  writable: true,
});

// Mock fetch for testing
globalThis.fetch = vi.fn();

// Mock ResizeObserver for Headless UI components
globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver for scroll-based components
globalThis.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});