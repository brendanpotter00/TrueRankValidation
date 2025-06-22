import type { Park } from "../data/parks";

// Fisher-Yates shuffle function
export const shuffleArray = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Apply Elo-style ranking algorithm to parks based on their appearance frequency and positions
 */
export const applyEloRanking = (parks: Park[]): Park[] => {
  if (!parks || parks.length === 0) return [];

  // Create a map to aggregate statistics by park ID
  const parkStats = new Map<
    string,
    {
      park: Park;
      appearances: number;
      totalPosition: number;
      firstPlaceCount: number;
      topThreeCount: number;
    }
  >();

  parks.forEach((park, index) => {
    const existing = parkStats.get(park.id);
    if (existing) {
      existing.appearances += 1;
      existing.totalPosition += index + 1; // +1 because index is 0-based
      if (index === 0) existing.firstPlaceCount += 1;
      if (index < 3) existing.topThreeCount += 1;
    } else {
      parkStats.set(park.id, {
        park: { ...park },
        appearances: 1,
        totalPosition: index + 1,
        firstPlaceCount: index === 0 ? 1 : 0,
        topThreeCount: index < 3 ? 1 : 0,
      });
    }
  });

  // Calculate Elo scores based on appearances, positions, and achievements
  const parksWithScores: Park[] = Array.from(parkStats.values()).map(
    ({ park, appearances, totalPosition, firstPlaceCount, topThreeCount }) => {
      // Calculate average position (lower is better)
      const averagePosition = totalPosition / appearances;

      // Elo-like scoring formula:
      // - Base score from appearances (more appearances = higher score)
      // - Bonus for better average position (lower position = higher score)
      // - Bonus for first place finishes
      // - Bonus for top 3 finishes
      const baseScore = appearances * 100;
      const positionBonus = Math.max(0, (63 - averagePosition) * 10); // 63 is total number of parks
      const firstPlaceBonus = firstPlaceCount * 500;
      const topThreeBonus = topThreeCount * 100;

      const eloScore =
        baseScore + positionBonus + firstPlaceBonus + topThreeBonus;

      return {
        ...park,
        votes: appearances, // Use appearances as votes
        visits: Math.floor(eloScore / 10), // Use scaled elo score as visits // TODO: change to be actual visits
        eloScore,
      };
    }
  );

  // Sort by Elo score descending
  return parksWithScores.sort((a, b) => (b.eloScore || 0) - (a.eloScore || 0));
};

/**
 * Get the top N parks from a ranked array
 */
export const getTopN = (parks: Park[], n: number): Park[] => {
  return parks.slice(0, n);
};

/**
 * Get the park with the highest votes count
 */
export const getMostLiked = (parks: Park[]): Park | null => {
  // TODO: change to be actual likes
  if (!parks || parks.length === 0) return null;

  return parks.reduce((max, current) => {
    const currentVotes = current.votes || 0;
    const maxVotes = max.votes || 0;
    return currentVotes > maxVotes ? current : max;
  });
};

/**
 * Get the park with the highest visits count
 */
export const getMostVisited = (parks: Park[]): Park | null => {
  if (!parks || parks.length === 0) return null;

  return parks.reduce((max, current) => {
    const currentVisits = current.visits || 0;
    const maxVisits = max.visits || 0;
    return currentVisits > maxVisits ? current : max;
  });
};
