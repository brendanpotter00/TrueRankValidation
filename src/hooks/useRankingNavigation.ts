import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCurrentStep, setRankedParks } from "../store/parksSlice";
import type { AppDispatch } from "../store/store";
import type { Park } from "../data/parks";

export const useRankingNavigation = (
  isComplete: boolean,
  sortedParks: Park[]
) => {
  const dispatch = useDispatch<AppDispatch>();

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.step === "selection") {
        dispatch(setCurrentStep("selection"));
      } else if (event.state?.step === "ranking") {
        dispatch(setCurrentStep("ranking"));
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Set initial history state for ranking page
    if (!window.history.state || window.history.state.step !== "ranking") {
      window.history.replaceState({ step: "ranking" }, "", "?step=ranking");
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dispatch]);

  // Handle completion navigation
  useEffect(() => {
    if (isComplete) {
      dispatch(setRankedParks(sortedParks));
      dispatch(setCurrentStep("results"));
      // Add to browser history for back button support
      window.history.pushState({ step: "results" }, "", "?step=results");
    }
  }, [isComplete, sortedParks, dispatch]);
};
