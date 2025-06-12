import { useRankingState } from "../../hooks/useRankingState";
import { useRankingNavigation } from "../../hooks/useRankingNavigation";
import { useDuplicateTracking } from "../../hooks/useDuplicateTracking";
import { usePageTracker } from "../../hooks/trackingHooks";
import { ParkComparison } from "../ranking/ParkComparison";
import { SortedParksGrid } from "../ranking/SortedParksGrid";
import { UndoButton } from "../ranking/UndoButton";
import { ProgressBar } from "../ranking/ProgressBar";

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
        firstPark={nextComparison.parkToInsert}
        secondPark={nextComparison.pivotPark}
        comparisonId={comparisonId}
        onChooseFirst={() => handleChoice(true)}
        onChooseSecond={() => handleChoice(false)}
      />

      <UndoButton onUndo={handleUndo} disabled={!canUndo} />

      <SortedParksGrid parks={sortedParks} />
    </div>
  );
};
