'use client';

import { useEffect, useState } from 'react';

/**
 * Delays updating a value until the caller has stopped changing it
 * for the specified delay (default 300 ms).
 *
 * Typical use: debounce a search input before firing an API call.
 *
 * @example
 * const debouncedQuery = useDebounce(searchQuery, 400);
 * useEffect(() => { fetchResults(debouncedQuery); }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
