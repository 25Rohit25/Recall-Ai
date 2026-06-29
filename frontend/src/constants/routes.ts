/**
 * Single source of truth for all application routes.
 * Prevents magic strings and broken links if URL structures change.
 */
export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  
  // Dashboard
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  
  // Meeting Detail
  MEETING: (id: string) => `/meetings/${id}`,
  
  // Storage
  STORAGE: "/storage",
  
  // Search
  SEARCH: "/search"
} as const;
