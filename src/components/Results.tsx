import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { resetState, setCurrentStep } from "../store/parksSlice";
import type { RootState } from "../store/types";
import type { AppDispatch } from "../store/store";
import type { Park } from "../data/parks";

export const Results = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rankedParks = useSelector(
    (state: RootState) => state.parks.rankedParks
  );

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.step === "ranking") {
        dispatch(setCurrentStep("ranking"));
      } else if (event.state?.step === "selection") {
        dispatch(setCurrentStep("selection"));
      } else if (event.state?.step === "results") {
        dispatch(setCurrentStep("results"));
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Set initial history state for results page
    if (!window.history.state || window.history.state.step !== "results") {
      window.history.replaceState({ step: "results" }, "", "?step=results");
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dispatch]);

  const handleRestart = () => {
    dispatch(resetState());
    // Add to browser history for back button support
    window.history.pushState({ step: "selection" }, "", "?step=selection");
  };

  return (
    <div className="results-container">
      <h2>Your Park Rankings</h2>
      <div className="rankings-list">
        {rankedParks.map((park: Park, index: number) => (
          <div key={park.id} className="ranking-item">
            <span className="rank-number">{index + 1}</span>
            <span className="park-name">{park.name}</span>
            <span className="park-state">{park.state}</span>
          </div>
        ))}
      </div>
      <button onClick={handleRestart} className="restart-button">
        Start Over
      </button>
    </div>
  );
};
