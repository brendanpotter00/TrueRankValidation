import type { Park } from "../data/parks";

export interface ParksState {
  selectedParks: Park[];
  rankedParks: Park[];
  currentStep: "selection" | "ranking" | "results";
}

export interface RootState {
  parks: ParksState;
}
