import { useState, useEffect } from 'react';

/**
 * A custom hook that animates a value changing from one number to another
 * @param targetValue The target value to animate to
 * @param duration The duration of the animation in milliseconds
 * @param precision The number of decimal places to round to
 * @returns The current animated value
 */
const useAnimatedValue = (targetValue: number, duration = 1000, precision = 1): number => {
  const [animatedValue, setAnimatedValue] = useState(targetValue);
  
  useEffect(() => {
    // If the target value hasn't changed, don't animate
    if (targetValue === animatedValue) return;
    
    let startTime: number | null = null;
    const startValue = animatedValue;
    const changeInValue = targetValue - startValue;
    
    const animateValue = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smooth animation (ease-out-cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      // Calculate the current value based on progress
      const currentValue = startValue + changeInValue * easedProgress;
      
      // Round to specified precision
      const roundedValue = Number(currentValue.toFixed(precision));
      
      setAnimatedValue(roundedValue);
      
      // Continue animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animateValue);
      }
    };
    
    requestAnimationFrame(animateValue);
    
    // Cleanup function
    return () => {
      startTime = null;
    };
  }, [targetValue, duration, precision]);
  
  return animatedValue;
};

export default useAnimatedValue;