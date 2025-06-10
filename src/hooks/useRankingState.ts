import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  saveRankingStep,
  undoLastRankingStep,
  clearRankingHistory,
} from "../store/parksSlice";
import type { RootState, InsertJob } from "../store/types";
import type { AppDispatch } from "../store/store";
import type { Park } from "../data/parks";
import { shuffleArray } from "../utils/arrayUtils";

interface ComparisonState {
  job: InsertJob;
  jobIndex: number;
  pivotIndex: number;
  pivotPark: Park;
}

interface RestoredComparison {
  jobIndex: number;
  pivotIndex: number;
}

// Internal job type with Set for performance
interface InternalJob extends Omit<InsertJob, "tried"> {
  tried: Set<number>;
}

// Helper functions to convert between Set and Array
const jobToInternal = (job: InsertJob): InternalJob => ({
  ...job,
  tried: new Set(job.tried),
});

const jobToExternal = (job: InternalJob): InsertJob => ({
  ...job,
  tried: Array.from(job.tried),
});

export const useRankingState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedParks = useSelector(
    (state: RootState) => state.parks.selectedParks
  );
  const rankingHistory = useSelector(
    (state: RootState) => state.parks.rankingHistory
  );

  const [sortedParks, setSortedParks] = useState<Park[]>([]);
  const [jobs, setJobs] = useState<InternalJob[]>([]); // Use internal type with Set
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [comparisonId, setComparisonId] = useState(0);
  const [restoredComparison, setRestoredComparison] =
    useState<RestoredComparison | null>(null);

  // Initialize jobs whenever selectedParks changes
  useEffect(() => {
    if (selectedParks.length === 0) {
      setSortedParks([]);
      setJobs([]);
      setIsInitialLoading(true);
      setRestoredComparison(null);
      return;
    }

    // Shuffle the parks
    const shuffledParks = shuffleArray(selectedParks);

    // Create jobs with initial bounds [0,0] and empty tried set
    const initialJobs: InternalJob[] = shuffledParks.map((park: Park) => ({
      park,
      low: 0,
      high: 0,
      tried: new Set<number>(),
    }));

    // Pull first job and seed sortedParks
    const [firstJob, ...remainingJobs] = initialJobs;
    setSortedParks([firstJob.park]);

    // Update remaining jobs bounds to [0, 1] since sortedParks.length will be 1
    const updatedJobs = remainingJobs.map((job) => ({
      ...job,
      low: 0,
      high: 1,
      tried: new Set<number>(),
    }));

    setJobs(updatedJobs);
    setIsInitialLoading(false);
    setComparisonId(0);
    setRestoredComparison(null);
    dispatch(clearRankingHistory());
  }, [selectedParks, dispatch]);

  // Remove the problematic bounds reset effect that was causing duplicates
  // The bounds should only be updated through handleChoice, not reset globally

  // Compute next comparison
  const nextComparison = useMemo((): ComparisonState | null => {
    if (jobs.length === 0) return null;

    // If we have a restored comparison, use it
    if (restoredComparison) {
      const { jobIndex, pivotIndex } = restoredComparison;
      if (jobIndex < jobs.length && pivotIndex < sortedParks.length) {
        const job = jobToExternal(jobs[jobIndex]); // Convert to external format
        const pivotPark = sortedParks[pivotIndex];
        return {
          job,
          jobIndex,
          pivotIndex,
          pivotPark,
        };
      }
      // If restored comparison is invalid, clear it and fall through to random selection
      setRestoredComparison(null);
    }

    // Find a job that has untried pivots
    for (let attempts = 0; attempts < jobs.length * 2; attempts++) {
      // Randomly pick a job
      const jobIndex = Math.floor(Math.random() * jobs.length);
      const job = jobs[jobIndex];

      // Check if this job has any untried pivots in its range
      if (job.low >= job.high) continue;

      // Find all possible pivot indices in range
      const possiblePivots: number[] = [];
      for (let i = job.low; i < job.high; i++) {
        if (!job.tried.has(i)) {
          possiblePivots.push(i);
        }
      }

      // If no untried pivots, this job is exhausted, skip it
      if (possiblePivots.length === 0) continue;

      // Pick a random untried pivot
      const pivotIndex =
        possiblePivots[Math.floor(Math.random() * possiblePivots.length)];
      const pivotPark = sortedParks[pivotIndex];

      return {
        job: jobToExternal(job), // Convert to external format
        jobIndex,
        pivotIndex,
        pivotPark,
      };
    }

    // If we get here, all jobs might be exhausted - this shouldn't happen in normal operation
    console.warn(
      "No valid comparisons found - this might indicate an algorithm issue"
    );
    return null;
  }, [jobs, sortedParks, restoredComparison]);

  // Bump comparisonId when nextComparison changes and clear restored comparison
  useEffect(() => {
    if (nextComparison) {
      setComparisonId((prev) => prev + 1);
      // Clear restored comparison after it's been used
      if (restoredComparison) {
        setRestoredComparison(null);
      }
    }
  }, [nextComparison, restoredComparison]);

  const handleChoice = useCallback(
    (preferFirst: boolean) => {
      if (!nextComparison) return;

      const { jobIndex, pivotIndex } = nextComparison;
      const job = jobs[jobIndex];

      // Save current state before making the choice, including the comparison
      // Convert internal jobs to external format for Redux
      dispatch(
        saveRankingStep({
          sortedParks: [...sortedParks],
          jobs: jobs.map(jobToExternal),
          comparison: {
            jobIndex,
            pivotIndex,
          },
        })
      );

      // Mark this pivot as tried for this job
      const updatedJobs = [...jobs];
      updatedJobs[jobIndex] = {
        ...job,
        tried: new Set([...job.tried, pivotIndex]),
      };

      // Compute new bounds based on user choice
      const newLow = preferFirst ? job.low : pivotIndex + 1;
      const newHigh = preferFirst ? pivotIndex : job.high;

      if (newLow >= newHigh) {
        // Insert park into sortedParks and remove job
        const newSortedParks = [...sortedParks];
        newSortedParks.splice(newLow, 0, job.park);
        setSortedParks(newSortedParks);

        // Remove the completed job
        const newJobs = updatedJobs.filter((_, index) => index !== jobIndex);
        setJobs(newJobs);
      } else {
        // Update job bounds and tried set
        updatedJobs[jobIndex] = {
          ...updatedJobs[jobIndex],
          low: newLow,
          high: newHigh,
        };
        setJobs(updatedJobs);
      }
    },
    [nextComparison, jobs, sortedParks, dispatch]
  );

  const handleUndo = useCallback(() => {
    if (rankingHistory.length === 0) return;

    const lastStep = rankingHistory[rankingHistory.length - 1];
    setSortedParks([...lastStep.sortedParks]);
    // Restore jobs and convert from external to internal format
    setJobs(lastStep.jobs.map(jobToInternal));

    // Restore the exact comparison that was shown
    if (lastStep.comparison) {
      setRestoredComparison(lastStep.comparison);
    }

    dispatch(undoLastRankingStep());
  }, [rankingHistory, dispatch]);

  const progressPercentage = useMemo(() => {
    return selectedParks.length > 0
      ? (sortedParks.length / selectedParks.length) * 100
      : 0;
  }, [sortedParks.length, selectedParks.length]);

  const isComplete = jobs.length === 0 && sortedParks.length > 0;
  const canUndo = rankingHistory.length > 0;

  return {
    sortedParks,
    jobs: jobs.map(jobToExternal), // Convert to external format for consumers
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
