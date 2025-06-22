import type { Park } from "../data/parks";

/**
 * Shuffles an array using the Fisher-Yates algorithm
 *
 * @template T The type of array elements
 * @param array The array to shuffle
 * @returns A new shuffled array (original array is not modified)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Get the top N parks from a ranked array
 *
 * @param parks Array of parks (should be pre-sorted by ranking)
 * @param n Number of top parks to return
 * @returns Array containing the first n parks
 */
export const getTopN = (parks: Park[], n: number): Park[] => {
  if (!Array.isArray(parks) || parks.length === 0) return [];
  if (typeof n !== "number" || n < 0) return [];

  return parks.slice(0, Math.floor(n));
};

/**
 * Get the park with the highest votes count
 *
 * @param parks Array of parks to search
 * @returns Park with highest votes, or null if array is empty
 */
export const getMostLiked = (parks: Park[]): Park | null => {
  if (!parks || parks.length === 0) return null;

  return parks.reduce((max, current) => {
    const currentVotes = current.votes || 0;
    const maxVotes = max.votes || 0;
    return currentVotes > maxVotes ? current : max;
  });
};

/**
 * Get the park with the highest visits count
 *
 * @param parks Array of parks to search
 * @returns Park with highest visits, or null if array is empty
 */
export const getMostVisited = (parks: Park[]): Park | null => {
  if (!parks || parks.length === 0) return null;

  return parks.reduce((max, current) => {
    const currentVisits = current.visits || 0;
    const maxVisits = max.visits || 0;
    return currentVisits > maxVisits ? current : max;
  });
};