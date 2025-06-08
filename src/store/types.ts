import type { Park } from "../data/parks";

interface RankingStep {
  sortedParks: Park[];
  remainingParks: Park[];
  currentPark: Park;
  low: number;
  high: number;
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
