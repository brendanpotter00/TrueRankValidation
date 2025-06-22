import type { Park } from "../../data/parks";
import type { ParkStatsWithPositions, EloConfig } from "./config";
import { RANKING_CONFIG } from "./config";

/**
 * Calculate Elo score for a park based on its statistics and configuration
 *
 * @param stats Park statistics
 * @param config Elo scoring configuration
 * @returns Calculated Elo score
 */
export function calculateEloScore(
  stats: ParkStatsWithPositions,
  config: EloConfig = RANKING_CONFIG.ELO_WEIGHTS
): number {
  const finalAveragePosition = stats.averagePosition / stats.appearances;

  const baseScore = stats.appearances * config.BASE_MULTIPLIER;
  const positionBonus = Math.max(
    0,
    (63 - finalAveragePosition) * config.POSITION_MULTIPLIER
  );
  const firstPlaceBonus = stats.firstPlaceCount * config.FIRST_PLACE_BONUS;
  const topThreeBonus = stats.topThreeCount * config.TOP_THREE_BONUS;
  const topFiveBonus = stats.topFiveCount * config.TOP_FIVE_BONUS;
  const topTenBonus = stats.topTenCount * config.TOP_TEN_BONUS;

  return (
    baseScore +
    positionBonus +
    firstPlaceBonus +
    topThreeBonus +
    topFiveBonus +
    topTenBonus
  );
}

/**
 * Rank parks by Elo score and return sorted array
 *
 * @param parkStats Map of park statistics
 * @returns Array of parks sorted by Elo score (highest first)
 */
export function rankParksByElo(
  parkStats: Map<string, ParkStatsWithPositions>
): Park[] {
  const parksWithScores: Park[] = Array.from(parkStats.values()).map(
    (stats) => {
      const eloScore = calculateEloScore(stats);

      return {
        ...stats.park,
        votes: stats.topThreeCount,
        visits: stats.appearances,
        eloScore,
      };
    }
  );

  return parksWithScores.sort((a, b) => (b.eloScore || 0) - (a.eloScore || 0));
}