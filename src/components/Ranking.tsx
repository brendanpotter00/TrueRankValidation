import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import * as Progress from "@radix-ui/react-progress";
import {
  setRankedParks,
  setCurrentStep,
  saveRankingStep,
  undoLastRankingStep,
  clearRankingHistory,
} from "../store/parksSlice";
import type { RootState } from "../store/types";
import type { AppDispatch } from "../store/store";
import type { Park } from "../data/parks";

export const Ranking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedParks = useSelector(
    (state: RootState) => state.parks.selectedParks
  );
  const rankingHistory = useSelector(
    (state: RootState) => state.parks.rankingHistory
  );

  const [sortedParks, setSortedParks] = useState<Park[]>([]);
  const [remainingParks, setRemainingParks] = useState<Park[]>([]);
  const [currentPark, setCurrentPark] = useState<Park | null>(null);
  const [currentComparison, setCurrentComparison] = useState<
    [Park, Park] | null
  >(null);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [comparisonId, setComparisonId] = useState(0);

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

  // Reset whenever selection changes
  useEffect(() => {
    setRemainingParks([...selectedParks]);
    setSortedParks([]);
    setCurrentPark(null);
    setCurrentComparison(null);
    setIsInitialLoading(true);
    setComparisonId(0);
    dispatch(clearRankingHistory());
  }, [selectedParks, dispatch]);

  // Increment comparisonId whenever currentComparison changes
  useEffect(() => {
    if (currentComparison) {
      setComparisonId((prev) => prev + 1);
    }
  }, [currentComparison]);

  // Kick off next park's insertion whenever we've just inserted or on init
  useEffect(() => {
    if (remainingParks.length === 0) return;

    // If no one is currently being compared, dequeue next park
    if (!currentPark && !currentComparison) {
      const [next, ...rest] = remainingParks;
      setCurrentPark(next);
      setRemainingParks(rest);

      // If first in list, just seed sortedParks and clear currentPark
      if (sortedParks.length === 0) {
        setSortedParks([next]);
        setCurrentPark(null);
        setIsInitialLoading(false);
      } else {
        // Begin binary-search bounds
        setLow(0);
        setHigh(sortedParks.length);
        const mid = Math.floor(sortedParks.length / 2);
        setCurrentComparison([next, sortedParks[mid]]);
        setIsInitialLoading(false);
      }
    }
  }, [
    remainingParks.length,
    currentPark,
    currentComparison,
    sortedParks.length,
  ]);

  // When done, dispatch results
  useEffect(() => {
    if (remainingParks.length === 0 && !currentPark && sortedParks.length > 0) {
      dispatch(setRankedParks(sortedParks));
      dispatch(setCurrentStep("results"));
      // Add to browser history for back button support
      window.history.pushState({ step: "results" }, "", "?step=results");
    }
  }, [remainingParks.length, currentPark, sortedParks.length, dispatch]);

  const handleChoice = useCallback(
    (preferFirst: boolean) => {
      if (!currentComparison || !currentPark) return;

      // Save current state before making the choice
      dispatch(
        saveRankingStep({
          sortedParks: [...sortedParks],
          remainingParks: [...remainingParks],
          currentPark,
          low,
          high,
        })
      );

      // Compute new bounds based on user choice
      const mid = Math.floor((low + high) / 2);
      const newLow = preferFirst ? low : mid + 1;
      const newHigh = preferFirst ? mid : high;

      if (newLow < newHigh) {
        // Continue binary search
        setLow(newLow);
        setHigh(newHigh);
        const nextMid = Math.floor((newLow + newHigh) / 2);
        setCurrentComparison([currentPark, sortedParks[nextMid]]);
      } else {
        // 1) insert into sorted
        const nextSorted = [...sortedParks];
        nextSorted.splice(newLow, 0, currentPark);
        setSortedParks(nextSorted);

        setLow(0);
        setHigh(nextSorted.length);

        // 2) Check if there are more parks to rank
        if (remainingParks.length > 0) {
          // dequeue next park and set up comparison
          const [next, ...rest] = remainingParks;
          setRemainingParks(rest);
          setCurrentPark(next);

          // 3) compute its comparison
          const mid = Math.floor(0 + nextSorted.length / 2);
          const nextComp: [Park, Park] = [next, nextSorted[mid]];
          setCurrentComparison(nextComp);
        } else {
          // No more parks to rank, clear state to trigger completion
          setRemainingParks([]);
          setCurrentPark(null);
          setCurrentComparison(null);
        }
      }
    },
    [
      currentComparison,
      currentPark,
      dispatch,
      sortedParks,
      remainingParks,
      low,
      high,
    ]
  );

  const handleUndo = useCallback(() => {
    if (rankingHistory.length === 0) return;

    const lastStep = rankingHistory[rankingHistory.length - 1];
    setSortedParks([...lastStep.sortedParks]);
    setRemainingParks([...lastStep.remainingParks]);
    setCurrentPark(lastStep.currentPark);
    setLow(lastStep.low);
    setHigh(lastStep.high);

    // Set up the comparison again
    const mid = Math.floor((lastStep.low + lastStep.high) / 2);
    setCurrentComparison([lastStep.currentPark, lastStep.sortedParks[mid]]);

    dispatch(undoLastRankingStep());
  }, [rankingHistory, dispatch]);

  // Memoize progress calculation to prevent unnecessary re-renders
  const progressPercentage = useMemo(() => {
    return selectedParks.length > 0
      ? (sortedParks.length / selectedParks.length) * 100
      : 0;
  }, [sortedParks.length, selectedParks.length]);

  // Show a loading state until we have a pair to compare
  if (isInitialLoading) {
    return <div>…Preparing your ranking…</div>;
  }
  // and later, if you really want to guard against stray states:
  if (!currentComparison) {
    return null;
  }

  return (
    <div className="ranking-container">
      <div className="ranking-header">
        <h2>Which park do you prefer?</h2>
      </div>
      <div className="progress-section">
        <Progress.Root className="progress-root" value={progressPercentage}>
          <Progress.Indicator
            className="progress-indicator"
            style={{ transform: `translateX(-${100 - progressPercentage}%)` }}
          />
        </Progress.Root>
      </div>
      <div className="park-comparison">
        <button
          key={`${currentComparison[0].name}-${comparisonId}`}
          className="park-choice"
          onClick={() => handleChoice(true)}
        >
          <img
            src={currentComparison[0].imageUrl}
            alt={`${currentComparison[0].name} poster`}
            className="park-image"
          />
          <span className="park-title">{currentComparison[0].name}</span>
        </button>
        <span className="vs">VS</span>
        <button
          key={`${currentComparison[1].name}-${comparisonId}`}
          className="park-choice"
          onClick={() => handleChoice(false)}
        >
          <img
            src={currentComparison[1].imageUrl}
            alt={`${currentComparison[1].name} poster`}
            className="park-image"
          />
          <span className="park-title">{currentComparison[1].name}</span>
        </button>
      </div>
      <div className="undo-section">
        <button
          onClick={handleUndo}
          className="nav-button undo-button"
          disabled={rankingHistory.length === 0}
          title="Undo last choice"
        >
          <ChevronLeftIcon />
        </button>
      </div>
      <div>
        {" "}
        {sortedParks.map((p) => {
          return <p>{p.name}</p>;
        })}
      </div>
    </div>
  );
};
