import { useState, useEffect } from "react";
import type { Park } from "../data/parks";
import { devLog } from "../utils/environment";

interface ComparisonState {
  parkToInsert: Park;
  pivotIndex: number;
  pivotPark: Park;
}

export const useDuplicateTracking = (
  nextComparison: ComparisonState | null
) => {
  const [dups, setDups] = useState<Map<string, boolean>>(new Map());

  useEffect(() => {
    if (!nextComparison) return;

    const { pivotIndex, parkToInsert, pivotPark } = nextComparison;
    const key = `${parkToInsert.id}-${pivotIndex}`;

    setDups((prev) => {
      if (prev.has(key)) {
        // log the two parks being re-compared
        devLog(
          `Duplicate comparison: "${parkToInsert.name}" vs "${pivotPark.name}" (key=${key})`
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
