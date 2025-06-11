import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface SessionCounterProps {
  duration?: number; // Animation duration in seconds
  className?: string;
}

export function SessionCounter({
  duration = 2,
  className = "",
}: SessionCounterProps) {
  const [totalSessions, setTotalSessions] = useState<number>(0);
  const [displayCount, setDisplayCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch total session count
  useEffect(() => {
    const fetchSessionCount = async () => {
      try {
        const { count, error } = await supabase
          .from("sessions")
          .select("*", { count: "exact", head: true });

        if (error) {
          console.error("Error fetching session count:", error);
          setTotalSessions(0);
        } else {
          setTotalSessions(count || 0);
        }
      } catch (err) {
        console.error("Failed to fetch session count:", err);
        setTotalSessions(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionCount();
  }, []);

  // Animate counter when totalSessions changes
  useEffect(() => {
    if (totalSessions === 0) return;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = totalSessions;
    const durationMs = duration * 1000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(
        startValue + (endValue - startValue) * easeOutQuart
      );

      setDisplayCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [totalSessions, duration]);

  if (isLoading) {
    return (
      <div className={`session-counter ${className}`}>
        <div className="counter-value">...</div>
        <div className="counter-label">Total Sessions</div>
      </div>
    );
  }

  return (
    <div className={`session-counter ${className}`}>
      <div className="counter-value">{displayCount.toLocaleString()}</div>
      <div className="counter-label">Total Sessions</div>
    </div>
  );
}
