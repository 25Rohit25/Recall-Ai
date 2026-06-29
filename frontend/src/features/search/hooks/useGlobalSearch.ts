'use client';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/searchService';
import { useState, useEffect } from 'react';

// Custom debounce hook for efficient typing
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const useGlobalSearch = (query: string) => {
  const debouncedQuery = useDebounce(query, 300);
  
  return useQuery({
    queryKey: ['globalSearch', debouncedQuery],
    queryFn: () => searchService.globalSearch(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 1000,
  });
};

export const useRecentSearches = () => {
  return useQuery({
    queryKey: ['recentSearches'],
    queryFn: () => searchService.getRecentSearches(),
  });
};
