import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRankedParks, setCurrentStep } from "../store/parksSlice";
import type { RootState } from "../store/types";
import type { AppDispatch } from "../store/store";
import type { Park } from "../data/parks";

export const Ranking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedParks = useSelector(
    (state: RootState) => state.parks.selectedParks
  );

  const [sortedParks, setSortedParks] = useState<Park[]>([]);
  const [remainingParks, setRemainingParks] = useState<Park[]>([]);
  const [currentPark, setCurrentPark] = useState<Park | null>(null);
  const [currentComparison, setCurrentComparison] = useState<
    [Park, Park] | null
  >(null);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);

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
  }, [selectedParks]);

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
      } else {
        // Begin binary-search bounds
        setLow(0);
        setHigh(sortedParks.length);
        const mid = Math.floor(sortedParks.length / 2);
        setCurrentComparison([next, sortedParks[mid]]);
      }
    }
  }, [remainingParks, currentPark, currentComparison, sortedParks]);

  // When done, dispatch results
  useEffect(() => {
    if (remainingParks.length === 0 && !currentPark && sortedParks.length > 0) {
      dispatch(setRankedParks(sortedParks));
      dispatch(setCurrentStep("results"));
      // Add to browser history for back button support
      window.history.pushState({ step: "results" }, "", "?step=results");
    }
  }, [remainingParks, currentPark, sortedParks, dispatch]);

  const handleChoice = (preferFirst: boolean) => {
    if (!currentComparison || !currentPark) return;

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
      // Insert currentPark at position newLow
      const nextSorted = [...sortedParks];
      nextSorted.splice(newLow, 0, currentPark);
      setSortedParks(nextSorted);

      // Reset for next park
      setCurrentPark(null);
      setCurrentComparison(null);
    }
  };

  // Show a loading state until we have a pair to compare
  if (!currentComparison) {
    return <div>Preparing your ranking…</div>;
  }

  return (
    <div className="ranking-container">
      <h2>Which park do you prefer?</h2>
      <div className="park-comparison">
        <button className="park-choice" onClick={() => handleChoice(true)}>
          {currentComparison[0].name}
        </button>
        <span className="vs">VS</span>
        <button className="park-choice" onClick={() => handleChoice(false)}>
          {currentComparison[1].name}
        </button>
      </div>
      <div className="progress">
        Ranked {sortedParks.length} of {selectedParks.length}
      </div>
    </div>
  );
};
