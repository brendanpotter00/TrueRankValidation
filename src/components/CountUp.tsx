import { useState, useEffect } from "react";
import "../styles/components/CountUp.css";

interface CountUpProps {
  target: number;
  duration?: number;
  className?: string;
  color?: "primary" | "secondary" | "accent";
}

export function CountUp({
  target,
  duration = 2000,
  className = "",
  color = "primary",
}: CountUpProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setCurrent(0);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic function - starts fast, slows down
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      const currentValue = Math.floor(
        startValue + (target - startValue) * easeOutCubic
      );

      setCurrent(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrent(target); // Ensure we end exactly at target
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span className={`count-up count-up--${color} ${className}`}>
      {current.toLocaleString()}
    </span>
  );
}
