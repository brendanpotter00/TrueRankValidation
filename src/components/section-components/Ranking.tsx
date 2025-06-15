import { useRankingState } from "../../hooks/useRankingState";
import { useRankingNavigation } from "../../hooks/useRankingNavigation";
import { useDuplicateTracking } from "../../hooks/useDuplicateTracking";
import { usePageTracker } from "../../hooks/trackingHooks";
import { ParkComparison } from "../ranking/ParkComparison";
import { SortedParksGrid } from "../ranking/SortedParksGrid";
import { UndoButton } from "../ranking/UndoButton";
import { ProgressBar } from "../ranking/ProgressBar";
import { parkImageMap } from "../../types/pictureTypes";

// Import all park images
const parkImages = import.meta.glob("/src/data/rectangle-photos/*.jpg", {
  eager: true,
});

export const Ranking = () => {
  const {
    sortedParks,
    isInitialLoading,
    comparisonId,
    nextComparison,
    progressPercentage,
    isComplete,
    canUndo,
    handleChoice,
    handleUndo,
  } = useRankingState();

  // Track page view for ranking page
  usePageTracker("/ranking", true);

  useRankingNavigation(isComplete, sortedParks);
  useDuplicateTracking(nextComparison);

  // Helper function to get image source
  const getImageSource = (parkId: string) => {
    const imagePath = `/src/data/rectangle-photos/${parkImageMap[parkId]}`;
    const imageModule = parkImages[imagePath] as { default: string };
    return imageModule?.default || "";
  };

  // Show a loading state until we have a comparison
  if (isInitialLoading || !nextComparison) {
    return <></>;
  }

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <h2>Which park do you prefer?</h2>
      </div>

      <ProgressBar percentage={progressPercentage} />

      <ParkComparison
        firstPark={{
          ...nextComparison.parkToInsert,
          imageUrl: getImageSource(nextComparison.parkToInsert.id),
        }}
        secondPark={{
          ...nextComparison.pivotPark,
          imageUrl: getImageSource(nextComparison.pivotPark.id),
        }}
        comparisonId={comparisonId}
        onChooseFirst={() => handleChoice(true)}
        onChooseSecond={() => handleChoice(false)}
      />

      <UndoButton onUndo={handleUndo} disabled={!canUndo} />

      {false && (
        <SortedParksGrid
          parks={sortedParks.map((park) => ({
            ...park,
            imageUrl: getImageSource(park.id),
          }))}
        />
      )}
    </div>
  );
};
