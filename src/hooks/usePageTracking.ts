// src/hooks/usePageTracking.ts
import { useEffect, useRef } from "react";
import { trackPageView } from "../lib/pageViews";

/**
 * Hook to automatically track page views when a component mounts
 */
export function usePageTracker(path: string, enabled: boolean = false) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (enabled && !hasTracked.current) {
      trackPageView(path);
      hasTracked.current = true;
    }
  }, [path, enabled]);

  // Reset tracking flag when path changes
  useEffect(() => {
    hasTracked.current = false;
  }, [path]);
}
