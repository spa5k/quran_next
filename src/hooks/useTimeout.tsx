import { useCallback, useEffect, useRef } from "react";

interface Timeout {
  reset: () => void;
  clear: () => void;
}

type TimeoutCallback = () => void;

function useTimeout(callback: TimeoutCallback, delay: number | null): Timeout {
  const callbackRef = useRef<TimeoutCallback>(callback);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Remember the latest callback if it changes.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Set up the timeout.
  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay ?? 0);
  }, [delay]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  useEffect(() => {
    if (delay !== null) {
      set();
      return clear;
    }
  }, [delay, set, clear]);

  return { reset, clear };
}

export default useTimeout;
