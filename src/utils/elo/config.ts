import type { Park } from "../../data/parks";

/** Raw stats for one park */
export interface ParkStats {
  appearances: number;
  averagePosition: number;
  firstPlaceCount: number;
  rankConsistency: number;
  topThreeCount: number;
  topFiveCount: number;
  topTenCount: number;
}

/** Observed min/max for each metric */
export interface MetricRange {
  min: number;
  max: number;
}

export type RangesMap = {
  [K in keyof ParkStats]: MetricRange;
};

/** Optional map indicating which metrics to invert */
export type InvertMap = {
  [K in keyof ParkStats]?: boolean;
};

/** Configuration for Elo ranking algorithm */
export interface EloConfig {
  BASE_MULTIPLIER: number;
  POSITION_MULTIPLIER: number;
  FIRST_PLACE_BONUS: number;
  TOP_THREE_BONUS: number;
  TOP_FIVE_BONUS: number;
  TOP_TEN_BONUS: number;
}

/** Park statistics with position tracking for consistency calculation */
export interface ParkStatsWithPositions extends ParkStats {
  park: Park;
  positions: number[];
}

// Configuration constants
export const RANKING_CONFIG = {
  ELO_WEIGHTS: {
    BASE_MULTIPLIER: 50,
    POSITION_MULTIPLIER: 10,
    FIRST_PLACE_BONUS: 500,
    TOP_THREE_BONUS: 250,
    TOP_FIVE_BONUS: 100,
    TOP_TEN_BONUS: 20,
  },
  INVERT_METRICS: {
    averagePosition: true, // Lower position is better
  } as const,
  METRIC_NAMES: [
    "appearances",
    "averagePosition",
    "firstPlaceCount",
    "topThreeCount",
    "topFiveCount",
    "topTenCount",
    "rankConsistency",
  ] as const,
} as const;