import type { Park } from "../../data/parks";
import type { ParkStats } from "./config";
import { RANKING_CONFIG } from "./config";
import { buildParkStatsMap, calculateMetricRanges } from "./statistics";
import { normalizeAllStats } from "./normalization";
import { rankParksByElo } from "./elo";

/**
 * Apply Elo-style ranking algorithm to parks based on their appearance frequency and positions
 * across multiple user ranking lists
 *
 * @param lists Array of park ranking lists from users
 * @returns Array of parks sorted by Elo score (highest first)
 */
export function applyEloRanking(lists: Park[][]): Park[] {
  if (!lists || lists.length === 0) return [];

  // Validate input lists
  const validLists = lists.filter(
    (list) => Array.isArray(list) && list.length > 0
  );
  if (validLists.length === 0) return [];

  // Build aggregated statistics for all parks
  const parkStats = buildParkStatsMap(validLists);

  // Calculate metric ranges for normalization
  const metricRanges = calculateMetricRanges(parkStats);

  // Create normalized statistics map
  const normalizedStatsMap = new Map<string, Record<keyof ParkStats, number>>();

  parkStats.forEach((stats, parkId) => {
    const finalAveragePosition = stats.averagePosition / stats.appearances;

    const parkStatsObj: ParkStats = {
      appearances: stats.appearances,
      averagePosition: finalAveragePosition,
      firstPlaceCount: stats.firstPlaceCount,
      rankConsistency: stats.rankConsistency,
      topThreeCount: stats.topThreeCount,
      topFiveCount: stats.topFiveCount,
      topTenCount: stats.topTenCount,
    };

    const normalizedStats = normalizeAllStats(
      parkStatsObj,
      metricRanges,
      RANKING_CONFIG.INVERT_METRICS
    );
    normalizedStatsMap.set(parkId, normalizedStats);
  });

  // Calculate final Elo scores and create ranked park list
  return rankParksByElo(parkStats);
}