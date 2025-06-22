import type { ParkStats, MetricRange, RangesMap, InvertMap } from "./config";

/**
 * Normalize a single metric into [0,1].
 *
 * @param value    The raw metric value.
 * @param range    The observed min/max for this metric.
 * @param invert   If true, lower raw values become higher normalized scores.
 * @returns        Normalized value in [0,1].
 */
export function normalizeMetric(
  value: number,
  range: MetricRange,
  invert = false
): number {
  if (typeof value !== "number" || !isFinite(value)) {
    throw new Error("Value must be a finite number");
  }

  const { min, max } = range;
  if (max === min) return 0; // avoid division by zero

  const norm = (value - min) / (max - min);
  const result = invert ? 1 - norm : norm;

  // Ensure result is within [0, 1] bounds
  return Math.max(0, Math.min(1, result));
}

/**
 * Normalize an entire ParkStats object.
 *
 * @param stats      The raw stats for one park.
 * @param ranges     Observed min/max values for each metric.
 * @param invertMap  Which metrics to invert (lower-is-better).
 * @returns          A new object with all metrics normalized to [0,1].
 */
export function normalizeAllStats(
  stats: ParkStats,
  ranges: RangesMap,
  invertMap: InvertMap = {}
): Record<keyof ParkStats, number> {
  const result: Partial<Record<keyof ParkStats, number>> = {};

  for (const key in stats) {
    if (Object.prototype.hasOwnProperty.call(ranges, key)) {
      const range = ranges[key as keyof ParkStats];
      const value = stats[key as keyof ParkStats];
      const invert = Boolean(invertMap[key as keyof ParkStats]);
      result[key as keyof ParkStats] = normalizeMetric(value, range, invert);
    } else {
      result[key as keyof ParkStats] = stats[key as keyof ParkStats];
    }
  }

  return result as Record<keyof ParkStats, number>;
}