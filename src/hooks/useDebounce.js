// src/hooks/useDebounce.js
// Returns a debounced version of the provided value.
// Used for search input to avoid firing a request on every keystroke.

import { useState, useEffect } from 'react';

/**
 * @param {T} value  The value to debounce
 * @param {number} delay  Delay in milliseconds (default: 300ms)
 * @returns {T} The debounced value
 * @template T
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
