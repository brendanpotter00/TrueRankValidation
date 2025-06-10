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

export const useRankingState = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedParks = useSelector(
    (state: RootState) => state.parks.selectedParks
  );
  const rankingHistory = useSelector(
    (state: RootState) => state.parks.rankingHistory
  );

  const [sortedParks, setSortedParks] = useState<Park[]>([]);
  const [jobs, setJobs] = useState<InsertJob[]>([]);
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

    // Create jobs with initial bounds [0,0]
    const initialJobs: InsertJob[] = shuffledParks.map((park: Park) => ({
      park,
      low: 0,
      high: 0,
    }));

    // Pull first job and seed sortedParks
    const [firstJob, ...remainingJobs] = initialJobs;
    setSortedParks([firstJob.park]);

    // Update remaining jobs bounds to [0, 1] since sortedParks.length will be 1
    const updatedJobs = remainingJobs.map((job) => ({
      ...job,
      low: 0,
      high: 1,
    }));

    setJobs(updatedJobs);
    setIsInitialLoading(false);
    setComparisonId(0);
    setRestoredComparison(null);
    dispatch(clearRankingHistory());
  }, [selectedParks, dispatch]);

  // Update job bounds whenever sortedParks changes (except during initial seeding)
  useEffect(() => {
    if (sortedParks.length > 0 && jobs.length > 0 && !restoredComparison) {
      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          low: Math.min(job.low, sortedParks.length),
          high: sortedParks.length,
        }))
      );
    }
  }, [sortedParks.length, jobs.length, restoredComparison]);

  // Compute next comparison
  const nextComparison = useMemo((): ComparisonState | null => {
    if (jobs.length === 0) return null;

    // If we have a restored comparison, use it
    if (restoredComparison) {
      const { jobIndex, pivotIndex } = restoredComparison;
      if (jobIndex < jobs.length && pivotIndex < sortedParks.length) {
        const job = jobs[jobIndex];
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

    // Randomly pick a job
    const jobIndex = Math.floor(Math.random() * jobs.length);
    const job = jobs[jobIndex];

    // Pick random pivot in [job.low, job.high)
    if (job.low >= job.high) return null;
    const pivotIndex =
      job.low + Math.floor(Math.random() * (job.high - job.low));
    // const pivotIndex = Math.floor((job.low + job.high) / 2);

    const pivotPark = sortedParks[pivotIndex];

    return {
      job,
      jobIndex,
      pivotIndex,
      pivotPark,
    };
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

      const { job, jobIndex, pivotIndex } = nextComparison;

      // Save current state before making the choice, including the comparison
      dispatch(
        saveRankingStep({
          sortedParks: [...sortedParks],
          jobs: [...jobs],
          comparison: {
            jobIndex,
            pivotIndex,
          },
        })
      );

      // Compute new bounds based on user choice
      const newLow = preferFirst ? job.low : pivotIndex + 1;
      const newHigh = preferFirst ? pivotIndex : job.high;

      if (newLow >= newHigh) {
        // Insert park into sortedParks and remove job
        const newSortedParks = [...sortedParks];
        newSortedParks.splice(newLow, 0, job.park);
        setSortedParks(newSortedParks);

        // Remove the completed job
        const newJobs = jobs.filter((_, index) => index !== jobIndex);
        setJobs(newJobs);
      } else {
        // Update job bounds
        const newJobs = [...jobs];
        newJobs[jobIndex] = {
          ...job,
          low: newLow,
          high: newHigh,
        };
        setJobs(newJobs);
      }
    },
    [nextComparison, jobs, sortedParks, dispatch]
  );

  const handleUndo = useCallback(() => {
    if (rankingHistory.length === 0) return;

    const lastStep = rankingHistory[rankingHistory.length - 1];
    setSortedParks([...lastStep.sortedParks]);
    setJobs([...lastStep.jobs]);

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
    jobs,
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
