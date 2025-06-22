/**
 * Calculate rank consistency using standard deviation of positions
 * Lower standard deviation means more consistent ranking
 *
 * @param positions Array of positions for a park across different lists
 * @returns Consistency score between 0 and 1 (1 = most consistent)
 */
export function calculateRankConsistency(positions: number[]): number {
  if (positions.length <= 1) return 1; // Perfect consistency with only one position

  const mean = positions.reduce((sum, pos) => sum + pos, 0) / positions.length;
  const variance =
    positions.reduce((sum, pos) => sum + Math.pow(pos - mean, 2), 0) /
    positions.length;
  const stdDev = Math.sqrt(variance);

  // Normalize by maximum possible standard deviation for the range
  const maxPos = Math.max(...positions);
  const minPos = Math.min(...positions);
  const maxPossibleStdDev = (maxPos - minPos) / 2;

  if (maxPossibleStdDev === 0) return 1; // All positions are the same

  const normalizedStdDev = stdDev / maxPossibleStdDev;
  return Math.max(0, 1 - normalizedStdDev); // Invert so higher = more consistent
}