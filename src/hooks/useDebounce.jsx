import { useEffect, useRef, useState } from "react";

export default function useDebounce(value, delay = 500) {
  const [debounceValue, setDeboucevalue] = useState(value);
  const timeoutRef = useRef(null);

  useEffect(() => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setDeboucevalue(value);
    }, delay);
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [value, delay]);
  const cancel = ()=> clearTimeout(timeoutRef.current)
  return [debounceValue,cancel];
}
