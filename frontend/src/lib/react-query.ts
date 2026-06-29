import { QueryClient } from "@tanstack/react-query";

// Global configuration for React Query
// This ensures caching and retry policies are strictly defined for an enterprise SaaS.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Keep inactive data in cache for 30 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 or 404 errors
        if (error?.response?.status === 401 || error?.response?.status === 403 || error?.response?.status === 404) {
          return false;
        }
        // Retry network failures up to 3 times
        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false, // Do not retry mutations automatically to prevent duplicate side-effects
    },
  },
});
