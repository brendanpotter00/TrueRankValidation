// import { Analytics } from "./Analytics";
import { CountUp } from "./CountUp";
import {
  getListsCount,
  getListsLengths,
  getPageViewCounts,
  getSessionCount,
} from "../lib/supabaseEndpoints";
import { useEffect, useState } from "react";
import "../styles/components/LandingMetrics.css";

export const LandingMetrics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionCount, setSessionCount] = useState<number | null>(null);
  const [listsCount, setListsCount] = useState<number | null>(null);
  const [avgListLength, setAvgListLengths] = useState<number | null>(null);

  const fetchAllMetrics = async () => {
    try {
      const fetchedCounts = await getPageViewCounts();
      const fetchedSessionCount = await getSessionCount();
      const fetchedListsCount = await getListsCount();
      const fetchedListsLengths = await getListsLengths();

      if (
        fetchedCounts.error ||
        fetchedSessionCount.error ||
        fetchedListsCount.error
      ) {
        setError(fetchedCounts.error || fetchedSessionCount.error);
      } else {
        setSessionCount(fetchedSessionCount.data);
        setListsCount(fetchedListsCount.data);
        setAvgListLengths(fetchedListsLengths?.data || null);
      }
    } catch (err) {
      setError("Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMetrics();
  }, []);

  if (error) {
    return <></>;
  }

  if (loading) {
    return <div></div>;
  }

  return (
    <div className="landing-metrics">
      <div className="landing-metrics-container">
        <div className="metric-item">
          <div className="metric-value">
            <CountUp target={sessionCount ?? 0} color="secondary" />
          </div>
          <div className="metric-label">Views</div>
        </div>
        <div className="metric-item">
          <div className="metric-value">
            <CountUp target={avgListLength ?? 0} color="primary" />
          </div>
          <div className="metric-label">Average Parks Visited</div>
        </div>

        <div className="metric-item">
          <div className="metric-value">
            <CountUp target={listsCount ?? 0} color="accent" />
          </div>
          <div className="metric-label">Total Lists</div>
        </div>
      </div>
      {/* <Analytics /> */}
    </div>
  );
};
