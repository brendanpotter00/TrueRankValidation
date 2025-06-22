import type { Park } from "../../data/parks";
import type { ParkStatsWithPositions, RangesMap, ParkStats } from "./config";
import { RANKING_CONFIG } from "./config";
import { calculateRankConsistency } from "./consistency";

/**
 * Build aggregated statistics map for all parks across ranking lists
 *
 * @param lists Array of park ranking lists
 * @returns Map of park ID to aggregated statistics with position tracking
 */
export function buildParkStatsMap(
  lists: Park[][]
): Map<string, ParkStatsWithPositions> {
  const parkStats = new Map<string, ParkStatsWithPositions>();

  lists.forEach((list) => {
    if (!list || list.length === 0) return;

    list.forEach((park, index) => {
      const position = index + 1;
      const existing = parkStats.get(park.id);

      if (existing) {
        existing.appearances += 1;
        existing.averagePosition += position;
        existing.positions.push(position);
        if (index === 0) existing.firstPlaceCount += 1;
        if (index < 3) existing.topThreeCount += 1;
        if (index < 5) existing.topFiveCount += 1;
        if (index < 10) existing.topTenCount += 1;
      } else {
        parkStats.set(park.id, {
          park: { ...park },
          appearances: 1,
          averagePosition: position,
          positions: [position],
          rankConsistency: 0, // Will be calculated later
          firstPlaceCount: index === 0 ? 1 : 0,
          topThreeCount: index < 3 ? 1 : 0,
          topFiveCount: index < 5 ? 1 : 0,
          topTenCount: index < 10 ? 1 : 0,
        });
      }
    });
  });

  // Calculate rank consistency for each park
  parkStats.forEach((stats) => {
    stats.rankConsistency = calculateRankConsistency(stats.positions);
  });

  return parkStats;
}

/**
 * Update metric ranges efficiently using a loop
 *
 * @param ranges Current ranges object to update
 * @param stats Park stats to process
 * @param finalAveragePosition Calculated average position
 */
export function updateMetricRanges(
  ranges: RangesMap,
  stats: ParkStatsWithPositions,
  finalAveragePosition: number
): void {
  const values = {
    appearances: stats.appearances,
    averagePosition: finalAveragePosition,
    firstPlaceCount: stats.firstPlaceCount,
    topThreeCount: stats.topThreeCount,
    topFiveCount: stats.topFiveCount,
    topTenCount: stats.topTenCount,
    rankConsistency: stats.rankConsistency,
  };

  for (const [key, value] of Object.entries(values)) {
    const metricKey = key as keyof ParkStats;
    ranges[metricKey].min = Math.min(ranges[metricKey].min, value);
    ranges[metricKey].max = Math.max(ranges[metricKey].max, value);
  }
}

/**
 * Initialize metric ranges with infinity values
 *
 * @returns Empty ranges object ready for population
 */
export function initializeMetricRanges(): RangesMap {
  const ranges = {} as RangesMap;

  for (const metricName of RANKING_CONFIG.METRIC_NAMES) {
    ranges[metricName] = { min: Infinity, max: -Infinity };
  }

  return ranges;
}

/**
 * Calculate metric ranges across all parks
 *
 * @param parkStats Map of park statistics
 * @returns Ranges object with min/max for each metric
 */
export function calculateMetricRanges(
  parkStats: Map<string, ParkStatsWithPositions>
): RangesMap {
  const ranges = initializeMetricRanges();

  parkStats.forEach((stats) => {
    const finalAveragePosition = stats.averagePosition / stats.appearances;
    updateMetricRanges(ranges, stats, finalAveragePosition);
  });

  return ranges;
}