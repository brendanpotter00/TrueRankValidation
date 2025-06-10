import type { Park } from "../data/parks";

export interface InsertJob {
  park: Park;
  low: number;
  high: number;
  tried: number[];
}

export interface RankingStep {
  sortedParks: Park[];
  jobs: InsertJob[];
  comparison?: {
    jobIndex: number;
    pivotIndex: number;
  };
}

export interface ParksState {
  selectedParks: Park[];
  rankedParks: Park[];
  currentStep: "selection" | "ranking" | "results";
  rankingHistory: RankingStep[];
}

export interface RootState {
  parks: ParksState;
}
