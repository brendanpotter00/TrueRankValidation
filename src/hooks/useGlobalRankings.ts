import { useState, useEffect } from "react";
import { getAllLists, getSessionCount } from "../supabase/supabaseEndpoints";
import { applyEloRanking } from "../utils/elo";
import { getTopN, getMostLiked, getMostVisited } from "../utils/arrayUtils";
import type { Park } from "../data/parks";

interface GlobalRankingsData {
  top20: Park[];
  mostLiked: Park | null;
  mostVisited: Park | null;
  totalVotes: number;
  totalParks: number;
  activeUsers: number;
  isLoading: boolean;
  error: string | null;
}

export const useGlobalRankings = (): GlobalRankingsData => {
  const [data, setData] = useState<GlobalRankingsData>({
    top20: [],
    mostLiked: null,
    mostVisited: null,
    totalVotes: 0,
    totalParks: 0,
    activeUsers: 0,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchGlobalRankings = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true, error: null }));

        // Fetch all lists
        const { data: allParks, error: listsError } = await getAllLists();

        if (listsError) {
          throw new Error(listsError);
        }

        if (!allParks || allParks.length === 0) {
          setData({
            top20: [],
            mostLiked: null,
            mostVisited: null,
            totalVotes: 0,
            totalParks: 0,
            activeUsers: 0,
            isLoading: false,
            error: null,
          });
          return;
        }

        // Apply Elo ranking
        const rankedParks = applyEloRanking(allParks);

        // Get top 20
        const top20 = getTopN(rankedParks, 20);

        // Get most liked and most visited
        const mostLiked = getMostLiked(rankedParks);
        const mostVisited = getMostVisited(rankedParks);

        // Calculate totals
        const totalVotes = rankedParks.reduce(
          (sum, park) => sum + (park.votes || 0),
          0
        );
        const totalParks = rankedParks.length;

        // Fetch active users count
        const { data: sessionCount, error: sessionError } =
          await getSessionCount();
        const activeUsers = sessionError ? 0 : sessionCount || 0;

        setData({
          top20,
          mostLiked,
          mostVisited,
          totalVotes,
          totalParks,
          activeUsers,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching global rankings:", error);
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch global rankings",
        }));
      }
    };

    fetchGlobalRankings();
  }, []);

  return data;
};
