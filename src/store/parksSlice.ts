import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Park } from "../data/parks";

interface ParksState {
  selectedParks: Park[];
  rankedParks: Park[];
  currentStep: "selection" | "ranking" | "results";
}

const initialState: ParksState = {
  selectedParks: [],
  rankedParks: [],
  currentStep: "selection",
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
    resetState: (state) => {
      state.selectedParks = [];
      state.rankedParks = [];
      state.currentStep = "selection";
    },
  },
});

export const {
  selectPark,
  deselectPark,
  setRankedParks,
  setCurrentStep,
  resetState,
} = parksSlice.actions;
export default parksSlice.reducer;
