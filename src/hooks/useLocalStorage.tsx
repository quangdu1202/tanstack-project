import { useCallback, useState } from 'react';

export const useLocalStorage = <T = unknown,>(
  key: string,
  initialValue?: T,
): [T, (value: T | ((prev: T) => T)) => void] => {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') return initialValue; // Avoid SSR issues

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedItem, setStoredItem] = useState<T>(readValue);

  const setLocalStorage = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const newValue = value instanceof Function ? value(storedItem) : value;

        setStoredItem(newValue);
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedItem], // Kept storedItem dependency (state updates trigger updates)
  );

  return [storedItem, setLocalStorage];
};
