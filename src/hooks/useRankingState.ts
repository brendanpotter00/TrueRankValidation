import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveRankingStep,
  undoLastRankingStep,
  clearRankingHistory,
} from "../store/parksSlice";
import type { RootState } from "../store/types";
import type { AppDispatch } from "../store/store";
import type { Park } from "../data/parks";
import { shuffleArray } from "../utils/arrayUtils";

interface ComparisonState {
  parkToInsert: Park;
  pivotIndex: number;
  pivotPark: Park;
}

interface BinarySearchState {
  low: number;
  high: number;
}

export const useRankingState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedParks = useSelector(
    (state: RootState) => state.parks.selectedParks
  );
  const rankingHistory = useSelector(
    (state: RootState) => state.parks.rankingHistory
  );

  const [sortedParks, setSortedParks] = useState<Park[]>([]);
  const [remainingParks, setRemainingParks] = useState<Park[]>([]);
  const [currentBinarySearch, setCurrentBinarySearch] =
    useState<BinarySearchState | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [comparisonId, setComparisonId] = useState(0);

  // Initialize when selectedParks changes
  useEffect(() => {
    if (selectedParks.length === 0) {
      setSortedParks([]);
      setRemainingParks([]);
      setCurrentBinarySearch(null);
      setIsInitialLoading(true);
      return;
    }

    // Shuffle the parks
    const shuffledParks = shuffleArray(selectedParks);

    // Take the first park as the initial sorted list
    const [firstPark, ...restParks] = shuffledParks;
    setSortedParks([firstPark]);
    setRemainingParks(restParks);

    // Start binary search for the first remaining park
    if (restParks.length > 0) {
      setCurrentBinarySearch({ low: 0, high: 1 });
    } else {
      setCurrentBinarySearch(null);
    }

    setIsInitialLoading(false);
    setComparisonId(0);
    dispatch(clearRankingHistory());
  }, [selectedParks, dispatch]);

  // Compute next comparison using binary search
  const nextComparison = useMemo((): ComparisonState | null => {
    if (remainingParks.length === 0 || !currentBinarySearch) return null;

    const { low, high } = currentBinarySearch;

    // If search space is exhausted, we found the insertion point
    if (low >= high) return null;

    // Find the middle point for binary search
    const pivotIndex = Math.floor((low + high) / 2);
    const pivotPark = sortedParks[pivotIndex];
    const parkToInsert = remainingParks[0];

    return {
      parkToInsert,
      pivotIndex,
      pivotPark,
    };
  }, [remainingParks, sortedParks, currentBinarySearch]);

  // Update comparisonId when nextComparison changes
  useEffect(() => {
    if (nextComparison) {
      setComparisonId((prev) => prev + 1);
    }
  }, [nextComparison]);

  const handleChoice = useCallback(
    (preferFirst: boolean) => {
      if (!nextComparison || !currentBinarySearch) return;

      const { pivotIndex } = nextComparison;
      const { low, high } = currentBinarySearch;

      // Save current state before making the choice
      dispatch(
        saveRankingStep({
          sortedParks: [...sortedParks],
          remainingParks: [...remainingParks],
          binarySearch: { ...currentBinarySearch },
        })
      );

      // Update binary search bounds based on user choice
      // preferFirst means the park to insert is preferred over the pivot
      // so it should go before the pivot (search in lower half)
      const newLow = preferFirst ? low : pivotIndex + 1;
      const newHigh = preferFirst ? pivotIndex : high;

      if (newLow >= newHigh) {
        // Found insertion point - insert the park
        const parkToInsert = remainingParks[0];
        const newSortedParks = [...sortedParks];
        newSortedParks.splice(newLow, 0, parkToInsert);
        setSortedParks(newSortedParks);

        // Remove the inserted park from remaining parks
        const newRemainingParks = remainingParks.slice(1);
        setRemainingParks(newRemainingParks);

        // Start binary search for next park if any remain
        if (newRemainingParks.length > 0) {
          setCurrentBinarySearch({ low: 0, high: newSortedParks.length });
        } else {
          setCurrentBinarySearch(null);
        }
      } else {
        // Continue binary search with updated bounds
        setCurrentBinarySearch({ low: newLow, high: newHigh });
      }
    },
    [nextComparison, currentBinarySearch, sortedParks, remainingParks, dispatch]
  );

  const handleUndo = useCallback(() => {
    if (rankingHistory.length === 0) return;

    const lastStep = rankingHistory[rankingHistory.length - 1];
    setSortedParks([...lastStep.sortedParks]);
    setRemainingParks([...lastStep.remainingParks]);
    setCurrentBinarySearch(
      lastStep.binarySearch ? { ...lastStep.binarySearch } : null
    );

    dispatch(undoLastRankingStep());
  }, [rankingHistory, dispatch]);

  const progressPercentage = useMemo(() => {
    return selectedParks.length > 0
      ? ((selectedParks.length - remainingParks.length) /
          selectedParks.length) *
          100
      : 0;
  }, [remainingParks.length, selectedParks.length]);

  const isComplete = remainingParks.length === 0 && sortedParks.length > 0;
  const canUndo = rankingHistory.length > 0;

  return {
    sortedParks,
    remainingParks,
    isInitialLoading,
    comparisonId,
    nextComparison,
    progressPercentage,
    isComplete,
    canUndo,
    handleChoice,
    handleUndo,
  };
};
