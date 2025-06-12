// src/hooks/usePageTracking.ts
import { useEffect, useRef } from "react";
import { trackLists, trackPageView } from "../lib/supabaseEndpoints";
import type { Park } from "../data/parks";

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

export function useTrackLists(list: Park[]) {
  useEffect(() => {
    trackLists(list);
  }, [list]);
}
