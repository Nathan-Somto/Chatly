import { useState, useEffect } from 'react';

function useDebounce<T>(value: T | (() => T), delay: number): T {
 const initialValue = value instanceof Function ? value() : value;
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export {useDebounce};
