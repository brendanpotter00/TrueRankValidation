import * as ToggleGroup from "@radix-ui/react-toggle-group";
// import { Cross1Icon } from "@radix-ui/react-icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { parks } from "../../data/parks";
import {
  selectPark,
  deselectPark,
  setCurrentStep,
} from "../../store/parksSlice";
import { usePageTracker } from "../../hooks/trackingHooks";
import { trackPageView } from "../../supabase/supabaseEndpoints";
import type { RootState } from "../../types/reduxTypes";
import type { AppDispatch } from "../../store/store";
import { parkImageMap } from "../../types/pictureTypes";

// Import all park images
const parkImages = import.meta.glob("/src/data/rectangle-photos/*.jpg", {
  eager: true,
});

export const Selection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedParks = useSelector(
    (state: RootState) => state.parks.selectedParks
  ).map((p) => p.id);

  // Track page view for selection page
  usePageTracker("/selection", true);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If no state or step is "selection", stay on selection page
      if (!event.state || event.state.step === "selection") {
        dispatch(setCurrentStep("selection"));
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Set initial history state for selection page
    if (!window.history.state) {
      window.history.replaceState({ step: "selection" }, "", "?step=selection");
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [dispatch]);

  const handleValueChange = (values: string[]) => {
    const newlySelected = values.filter((id) => !selectedParks.includes(id));
    const newlyDeselected = selectedParks.filter((id) => !values.includes(id));

    newlySelected.forEach((id) => {
      const park = parks.find((p) => p.id === id);
      if (park) dispatch(selectPark(park));
    });
    newlyDeselected.forEach((id) => dispatch(deselectPark(id)));
  };

  const handleNext = () => {
    // Track the conversion from selection to ranking (force track for actions)
    trackPageView("/action/start-ranking", true);

    dispatch(setCurrentStep("ranking"));
    // Add to browser history for back button support
    window.history.pushState({ step: "ranking" }, "", "?step=ranking");
  };

  // Helper function to get image source
  const getImageSource = (parkId: string) => {
    const imagePath = `/src/data/rectangle-photos/${parkImageMap[parkId]}`;
    const imageModule = parkImages[imagePath] as { default: string };
    return imageModule?.default || "";
  };

  // const handleClearSelection = () => {
  //   // Clear all selected parks
  //   selectedParks.forEach((id) => dispatch(deselectPark(id)));
  // };

  return (
    <div className="selection-container">
      <h2>select parks to rank</h2>
      <p>choose at least 2 parks to begin ranking</p>
      <ToggleGroup.Root
        type="multiple"
        className="parks-grid"
        value={selectedParks}
        onValueChange={handleValueChange}
      >
        {parks.map((park) => (
          <ToggleGroup.Item
            key={park.id}
            value={park.id}
            className="park-card"
            aria-label={park.name}
          >
            <img
              src={getImageSource(park.id)}
              alt={`${park.name} poster`}
              className="park-image"
              loading="lazy"
            />
            <span className="park-title">{park.name}</span>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      <button
        onClick={handleNext}
        disabled={selectedParks.length < 2}
        className="next-button"
      >
        Rank {`${selectedParks.length}`} Visited National Parks
      </button>
      {/* TODO add button */}
      {/* <button
        onClick={handleClearSelection}
        disabled={selectedParks.length === 0}
        className="clear-button"
        title="Clear all selections"
      >
        <Cross1Icon />
      </button> */}
    </div>
  );
};
