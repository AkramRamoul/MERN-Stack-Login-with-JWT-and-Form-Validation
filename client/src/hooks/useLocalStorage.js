import { useEffect, useState } from "react";
const getLocalValue = (key, initValue) => {
  if (typeof window === "undefined") return initValue;

  try {
    const localValue = JSON.parse(localStorage.getItem(key));
    if (localValue !== null) return localValue;
  } catch (error) {
    console.error(`Error parsing localStorage value for key "${key}":`, error);
  }

  if (initValue instanceof Function) return initValue();

  return initValue;
};

const useLocalStorage = (key, initValue) => {
  const [value, setValue] = useState(() => {
    return getLocalValue(key, initValue);
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
