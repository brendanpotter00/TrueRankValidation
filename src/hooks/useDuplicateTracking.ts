import { useState, useEffect } from "react";
import type { InsertJob } from "../store/types";
import type { Park } from "../data/parks";

interface ComparisonState {
  job: InsertJob;
  jobIndex: number;
  pivotIndex: number;
  pivotPark: Park;
}

export const useDuplicateTracking = (
  nextComparison: ComparisonState | null
) => {
  const [dups, setDups] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!nextComparison) return;

    const { jobIndex, pivotIndex, job, pivotPark } = nextComparison;
    const key = `${jobIndex}-${pivotIndex}`;

    setDups((prev) => {
      if (prev.has(key)) {
        // log the two parks being re-compared
        console.log(
          `Duplicate comparison: "${job.park.name}" vs "${pivotPark.name}" (key=${key})`
        );
        return prev;
      }
      const copy = new Map(prev);
      copy.set(key, true);
      return copy;
    });
  }, [nextComparison]);

  return { dups };
};
