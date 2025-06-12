import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setCurrentStep } from "../../store/parksSlice";
import { usePageTracker, useTrackLists } from "../../hooks/trackingHooks";
import type { RootState } from "../../store/types";
import type { AppDispatch } from "../../store/store";
import type { Park } from "../../data/parks";

// Custom hook to calculate columns based on screen width
const useResponsiveColumns = () => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;
      const itemWidth = 300; // Base width for each ranking item (280px + gap)
      const containerPadding = 48; // Account for container padding
      const availableWidth = width - containerPadding;

      // Calculate how many columns can fit
      const calculatedColumns = Math.floor(availableWidth / itemWidth);

      // Set minimum and maximum columns based on screen size
      if (width < 768) {
        setColumns(1); // Mobile: always 1 column
      } else if (width < 1024) {
        setColumns(Math.min(calculatedColumns, 2)); // Tablet: max 2 columns
      } else if (width < 1440) {
        setColumns(Math.min(calculatedColumns, 3)); // Desktop: max 3 columns
      } else {
        setColumns(Math.min(calculatedColumns, 4)); // Large desktop: max 4 columns
      }
    };

    calculateColumns();
    window.addEventListener("resize", calculateColumns);

    return () => window.removeEventListener("resize", calculateColumns);
  }, []);

  return columns;
};

export const Results = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rankedParks = useSelector(
    (state: RootState) => state.parks.rankedParks
  );
  const columns = useResponsiveColumns();

  // Calculate rows needed for proper top-to-bottom flow
  const rows = Math.ceil(rankedParks.length / columns);

  // Track page view for results page
  usePageTracker("/results", true);
  useTrackLists(rankedParks);

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
      {rankedParks.length > 0 && (
        <div
          className="hero-section"
          style={{
            backgroundImage: `url(${rankedParks[0].imageUrl})`,
          }}
        ></div>
      )}

      {rankedParks.length > 0 && (
        <div
          className="rankings-list"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, auto)`,
            gridAutoFlow: "column",
            gap: "1rem",
            justifyItems: "center",
          }}
        >
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
