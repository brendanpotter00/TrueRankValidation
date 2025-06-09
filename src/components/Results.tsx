import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCurrentStep } from "../store/parksSlice";
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

  return (
    <div className="results-container">
      {/* <div className="results-header">
        <h2>Your Park Rankings</h2>
      </div> */}

      {rankedParks.length > 0 && (
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${rankedParks[0].imageUrl})`,
          }}
        ></div>
      )}

      {rankedParks.length > 0 && (
        <div className="rankings-list">
          {rankedParks.map((park: Park, index: number) => (
            <div key={park.id} className="ranking-item">
              <span className="rank-number">#{index + 1}</span>
              <img
                src={park.imageUrl}
                alt={`${park.name}`}
                className="park-image"
              />
              <span className="park-name">{park.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
