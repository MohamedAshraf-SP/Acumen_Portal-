import { useMemo, useEffect } from "react";
import debounce from "lodash/debounce";

export const useDebounce = (func, delay = 500) => {
  // Memoize the debounced function
  const debouncedFunc = useMemo(() => debounce(func, delay), [func, delay]);

  // Cancel the debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedFunc.cancel();
    };
  }, []); // Empty dependency array ensures cleanup only runs on unmount

  return debouncedFunc;
};
