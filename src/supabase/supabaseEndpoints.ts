// src/lib/pageViews.ts
import type { Park } from "../data/parks";
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

export interface EmailSubscription {
  id?: string;
  email: string;
  created_at?: string;
}

// key in localStorage for our one-session-per-browser
const SESSION_KEY = "national-park-ranker-session";

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
 * Check if lists have already been tracked for the current session
 */
async function hasListsBeenTrackedInSession(
  sessionId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("lists")
    .select("id")
    .eq("session_id", sessionId)
    .limit(1);

  if (error) {
    console.error("Error checking if lists tracked:", error);
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

export async function getSessionCount() {
  try {
    const { count, error } = await supabase
      .from("sessions")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching final results count:", error);
      return { data: null, error: error.message };
    } else {
      return { data: count, error: null };
    }
  } catch (err) {
    console.error("Failed to fetch final results count:", err);
    return { data: null, error: "Failed to fetch final results count" };
  }
}

export async function trackLists(
  list: Park[]
): Promise<{ success: boolean; error?: string; skipped?: boolean }> {
  const { sessionId, error: sessionError } = await getCurrentSession();
  if (sessionError) {
    return { success: false, error: sessionError };
  }

  // Check if lists have already been tracked for this session
  if (await hasListsBeenTrackedInSession(sessionId)) {
    console.log(
      `📊 Skipping duplicate list tracking for session: ${sessionId}`
    );
    return { success: true, skipped: true };
  }

  const listJson = JSON.stringify(list);

  const { error } = await supabase.from("lists").insert([
    {
      session_id: sessionId,
      lists: listJson,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error tracking list:", error);
    return { success: false, error: error.message };
  }
  console.log(`📊 Tracked list: ${listJson} (session ${sessionId})`);
  return { success: true };
}

export async function getListsCount() {
  try {
    const { count, error } = await supabase
      .from("lists")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching lists count:", error);
      return { data: null, error: error.message };
    }

    return { data: count, error: null };
  } catch (err) {
    console.error("Failed to fetch lists count:", err);
    return { data: null, error: "Failed to fetch lists count" };
  }
}

export async function getListsLengths() {
  try {
    const { data, error } = await supabase.rpc("get_average_list_length");

    if (error) {
      console.error("Error fetching lists lengths:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error("Failed to fetch lists lengths:", err);
    return { data: null, error: "Failed to fetch lists lengths" };
  }
}

/**
 * Validates an email address format
 */
function isValidEmail(email: string): boolean {
  // RFC 5322 compliant email regex
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Subscribe an email to updates, preventing duplicates
 */
export async function subscribeEmail(
  email: string
): Promise<{ success: boolean; error?: string; isDuplicate?: boolean }> {
  try {
    const trimmedEmail = email.toLowerCase().trim();

    // Validate email format
    if (!isValidEmail(trimmedEmail)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    // Validate email length (most email providers have a max length of 254 characters)
    if (trimmedEmail.length > 254) {
      return {
        success: false,
        error: "Email address is too long",
      };
    }

    // First check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from("email_subscriptions")
      .select("email")
      .eq("email", trimmedEmail)
      .limit(1);

    if (checkError) {
      console.error("Error checking for existing email:", checkError);
      return { success: false, error: "An error occurred. Please try again." };
    }

    if (existing && existing.length > 0) {
      return { success: true, isDuplicate: true };
    }

    // If email doesn't exist, insert it
    const { error: insertError } = await supabase
      .from("email_subscriptions")
      .insert([
        {
          email: trimmedEmail,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      console.error("Error subscribing email:", insertError);
      return {
        success: false,
        error: "An error occurred. Please try again.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("Failed to subscribe email:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
