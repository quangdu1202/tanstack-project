// Debounce utility to limit frequent updates
export const debounce = (func: () => void, wait: number): (() => void) => {
  let timeout: number | undefined;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(), wait);
  };
};
