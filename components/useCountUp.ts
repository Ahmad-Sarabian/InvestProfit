import { useState, useEffect, useRef } from 'react';

// Easing function: easeOutCubic
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const useCountUp = (endValue: number, duration: number = 1500): number => {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number | null>(null);
  const startValueRef = useRef(0);

  useEffect(() => {
    // When the component first mounts or endValue changes from 0, start from 0.
    // Otherwise, start from the last rendered value for a smoother transition on re-calculation.
    startValueRef.current = count;
    
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = timestamp - startTime;
      const relativeProgress = Math.min(progress / duration, 1);
      const easedProgress = easeOutCubic(relativeProgress);
      const currentValue = startValueRef.current + (endValue - startValueRef.current) * easedProgress;
      
      setCount(currentValue);

      if (progress < duration) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue); // Ensure it ends exactly on the target value
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [endValue, duration]);

  return count;
};

export default useCountUp;
