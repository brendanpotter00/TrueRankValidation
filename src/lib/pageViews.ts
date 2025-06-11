// src/lib/pageViews.ts
import { supabase } from "./supabase";
import { v4 as uuidv4 } from "uuid";

export interface PageView {
  id?: string;
  viewed_at?: string;
  path: string;
  session_id?: string;
}

export interface Session {
  id?: string;
  created_at?: string;
}

// key in localStorage for our one-session-per-browser
const SESSION_KEY = "app_session_id";

// in-memory cache during this page-load
let currentSessionId: string | null = null;

/**
 * Get or create a session for the current browser session.
 * Persists the UUID in localStorage and upserts it into your sessions table.
 */
export async function getCurrentSession(): Promise<{
  sessionId: string;
  error?: string;
}> {
  // 1) if we already set it in this load, reuse it
  if (currentSessionId) {
    return { sessionId: currentSessionId };
  }

  // 2) try reading from localStorage
  const stored = localStorage.getItem(SESSION_KEY);
  if (stored) {
    currentSessionId = stored;
    return { sessionId: currentSessionId };
  }

  // 3) generate a fresh UUID and persist it
  const newId = uuidv4();
  localStorage.setItem(SESSION_KEY, newId);
  currentSessionId = newId;

  // 4) upsert that ID into sessions (won't create duplicates)
  const { error } = await supabase
    .from("sessions")
    .upsert([{ id: newId }], { onConflict: "id" });
  if (error) console.warn("Session upsert error", error);

  return { sessionId: newId };
}

/**
 * Check if a path has already been tracked for the current session
 */
async function hasBeenTrackedInSession(
  sessionId: string,
  path: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("page_views")
    .select("id")
    .eq("session_id", sessionId)
    .eq("path", path)
    .limit(1);

  if (error) {
    console.error("Error checking if path tracked:", error);
    return false;
  }
  return (data?.length ?? 0) > 0;
}

/**
 * Track a page view only once per session+path
 */
export async function trackPageView(
  path: string,
  forceTrack: boolean = false
): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  const { sessionId, error: sessionError } = await getCurrentSession();
  if (sessionError) {
    return { success: false, error: sessionError };
  }

  if (!forceTrack && (await hasBeenTrackedInSession(sessionId, path))) {
    console.log(`📊 Skipping duplicate path: ${path}`);
    return { success: true, skipped: true };
  }

  // use insert instead of upsert for simplicity
  const { error } = await supabase.from("page_views").insert([
    {
      session_id: sessionId,
      path,
      viewed_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error tracking page view:", error);
    return { success: false, error: error.message };
  }

  console.log(`📊 Tracked page view: ${path} (session ${sessionId})`);
  return { success: true };
}

/**
 * Get page view statistics
 */
export async function getPageViews(path?: string) {
  try {
    let query = supabase
      .from("page_views")
      .select("*")
      .order("viewed_at", { ascending: false });

    if (path) {
      query = query.eq("path", path);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching page views:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Failed to fetch page views:", err);
    return { data: null, error: "Failed to fetch page views" };
  }
}

/**
 * Get page view counts grouped by path
 */
export async function getPageViewCounts() {
  try {
    const { data, error } = await supabase.from("page_views").select("path");

    if (error) {
      console.error("Error fetching page view counts:", error);
      return { data: null, error: error.message };
    }

    // Group by path and count
    const counts = data?.reduce((acc: Record<string, number>, view) => {
      acc[view.path] = (acc[view.path] || 0) + 1;
      return acc;
    }, {});

    return { data: counts, error: null };
  } catch (err) {
    console.error("Failed to fetch page view counts:", err);
    return { data: null, error: "Failed to fetch page view counts" };
  }
}
