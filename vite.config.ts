/**
 * @fileoverview Vite configuration for optimized production builds
 * @module vite.config
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy API calls to avoid CORS issues during development
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
      rollupOptions: {
        output: {
          /**
           * Manual chunk strategy for optimal loading performance.
           * Separates vendor libraries from application code to maximize
           * browser caching effectiveness.
           */
          manualChunks: {
            // React core libraries - rarely change
            "react-vendor": ["react", "react-dom"],
            // Data fetching libraries - moderate change frequency
            "query-vendor": ["@tanstack/react-query"],
            // Router and navigation - moderate change frequency
            "router-vendor": ["react-router-dom"],
            // Utility libraries - rarely change
            "utils-vendor": ["axios", "date-fns", "zod"],
          },
        },
      },
    },
});
