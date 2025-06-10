import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Park } from "../data/parks";
import type { ParksState, InsertJob, RankingStep } from "./types";

const initialState: ParksState = {
  selectedParks: [],
  rankedParks: [],
  currentStep: "selection",
  rankingHistory: [],
};

export const parksSlice = createSlice({
  name: "parks",
  initialState,
  reducers: {
    selectPark: (state, action: PayloadAction<Park>) => {
      state.selectedParks.push(action.payload);
    },
    deselectPark: (state, action: PayloadAction<string>) => {
      state.selectedParks = state.selectedParks.filter(
        (park) => park.id !== action.payload
      );
    },
    setRankedParks: (state, action: PayloadAction<Park[]>) => {
      state.rankedParks = action.payload;
    },
    setCurrentStep: (
      state,
      action: PayloadAction<ParksState["currentStep"]>
    ) => {
      state.currentStep = action.payload;
    },
    saveRankingStep: (state, action: PayloadAction<RankingStep>) => {
      state.rankingHistory.push(action.payload);
    },
    undoLastRankingStep: (state) => {
      state.rankingHistory.pop();
    },
    clearRankingHistory: (state) => {
      state.rankingHistory = [];
    },
    resetState: (state) => {
      state.selectedParks = [];
      state.rankedParks = [];
      state.currentStep = "selection";
      state.rankingHistory = [];
    },
  },
});

export const {
  selectPark,
  deselectPark,
  setRankedParks,
  setCurrentStep,
  saveRankingStep,
  undoLastRankingStep,
  clearRankingHistory,
  resetState,
} = parksSlice.actions;
export default parksSlice.reducer;
