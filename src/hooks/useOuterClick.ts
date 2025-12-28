import { useEffect, useRef } from "react";

function useOuterClick(callback: (() => void) | undefined) {
  // Initialize mutable ref, which stores callback
  const callbackRef = useRef<(() => void) | undefined>(callback);
  // returned to client, who marks "border" element
  const innerRef = useRef<any>();

  // Update callback on each render, so second useEffect has access to current value
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleClick = (e: { target: any }) => {
      if (
        innerRef.current &&
        callbackRef.current &&
        !innerRef.current.contains(e.target)
      ) {
        callbackRef.current();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return innerRef;
}

export default useOuterClick;
