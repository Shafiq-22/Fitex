import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, subscribe } from '../lib/storage';

export function useStorage<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = getItem<T>(key);
    return stored !== null ? stored : defaultValue;
  });

  useEffect(() => {
    return subscribe(key, () => {
      const stored = getItem<T>(key);
      setValue(stored !== null ? stored : defaultValue);
    });
  }, [key, defaultValue]);

  const updateValue = useCallback((val: T | ((prev: T) => T)) => {
    setValue(prev => {
      const next = typeof val === 'function' ? (val as (prev: T) => T)(prev) : val;
      setItem(key, next);
      return next;
    });
  }, [key]);

  return [value, updateValue];
}
