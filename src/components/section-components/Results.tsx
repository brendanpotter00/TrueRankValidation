import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setCurrentStep } from "../../store/parksSlice";
import { usePageTracker, useTrackLists } from "../../hooks/trackingHooks";
import type { RootState } from "../../store/types";
import type { AppDispatch } from "../../store/store";
import type { Park } from "../../data/parks";
import { parkImageMap } from "../../types/pictureTypes";

// Import all park images
const parkImages = import.meta.glob("/src/data/rectangle-photos/*.jpg", {
  eager: true,
});

// Custom hook to calculate columns based on screen width
const useResponsiveColumns = (totalItems: number) => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;
      const itemWidth = 300; // Base width for each ranking item (280px + gap)
      const containerPadding = 48; // Account for container padding
      const availableWidth = width - containerPadding;

      // Calculate how many columns can fit based on screen width
      const maxColumnsByWidth = Math.floor(availableWidth / itemWidth);

      // Calculate max columns based on having at least 5 items per column
      const maxColumnsByItems = Math.floor(totalItems / 5);

      // Use the smaller of the two constraints
      const calculatedColumns = Math.min(maxColumnsByWidth, maxColumnsByItems);

      // Set minimum and maximum columns based on screen size (max 3 columns)
      if (width < 768) {
        setColumns(1); // Mobile: always 1 column
      } else if (width < 1024) {
        setColumns(Math.min(calculatedColumns, 2)); // Tablet: max 2 columns
      } else {
        setColumns(Math.min(calculatedColumns, 3)); // Desktop and larger: max 3 columns
      }
    };

    calculateColumns();
    window.addEventListener("resize", calculateColumns);

    return () => window.removeEventListener("resize", calculateColumns);
  }, [totalItems]);

  return columns;
};

export const Results = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rankedParks = useSelector(
    (state: RootState) => state.parks.rankedParks
  );
  const columns = useResponsiveColumns(rankedParks.length);

  // Calculate rows needed for proper top-to-bottom flow
  const rows = Math.ceil(rankedParks.length / columns);

  // Helper function to get image source
  const getImageSource = (parkId: string) => {
    const imagePath = `/src/data/rectangle-photos/${parkImageMap[parkId]}`;
    const imageModule = parkImages[imagePath] as { default: string };
    return imageModule?.default || "";
  };

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

  // Get the hero image source
  const heroImageSource =
    rankedParks.length > 0 ? getImageSource(rankedParks[0].id) : "";

  return (
    <div className="results-container">
      {rankedParks.length > 0 && (
        <div className="hero-section">
          <img
            src={heroImageSource}
            alt={`${rankedParks[0].name}`}
            className="hero-image"
          />
        </div>
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
                src={getImageSource(park.id)}
                alt={`${park.name}`}
                className="park-image"
                loading="lazy"
              />
              <span className="park-name">{park.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
