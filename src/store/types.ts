import type { Park } from "../data/parks";

export interface BinarySearchState {
  low: number;
  high: number;
}

export interface RankingStep {
  sortedParks: Park[];
  remainingParks: Park[];
  binarySearch: BinarySearchState | null;
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
