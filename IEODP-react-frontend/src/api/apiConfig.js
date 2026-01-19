/**
 * API Configuration Module
 * 
 * This module provides the base URL for all API calls, configurable via
 * environment variables. It reads from import.meta.env.VITE_API_BASE_URL
 * which can be set in .env files or at build time.
 * 
 * For local development: .env should have VITE_API_BASE_URL=http://localhost:8080
 * For Kubernetes/production: Set via build environment or ConfigMap injection
 */

/**
 * Get the API base URL from environment variables
 * Falls back to relative /api path if not specified
 * 
 * @returns {string} The base URL for all API requests
 */
export const getApiBaseUrl = () => {
  // First priority: explicit VITE_API_BASE_URL env variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Second priority: check for legacy VITE_API_URL (backward compatibility)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Fallback: Use relative path (works with reverse proxy if frontend and backend
  // are served from same origin, or with proper CORS configuration)
  return '/api';
};

/**
 * API Configuration object with the resolved base URL
 */
export const apiConfig = {
  baseUrl: getApiBaseUrl(),
};

// Log configuration in development for debugging
if (import.meta.env.DEV) {
  console.log('[API Config] Base URL:', apiConfig.baseUrl);
}

export default apiConfig;
