import { useState, useEffect } from "react";
import {
  getPageViewCounts,
  getPageViews,
} from "../../supabase/supabaseEndpoints";

interface PageViewCounts {
  [path: string]: number;
}

export function Analytics() {
  const [counts, setCounts] = useState<PageViewCounts | null>(null);
  const [recentViews, setRecentViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get page view counts
      const countsResult = await getPageViewCounts();
      if (countsResult.error) {
        setError(countsResult.error);
      } else {
        setCounts(countsResult.data);
      }

      // Get recent page views
      const recentResult = await getPageViews();
      if (recentResult.error) {
        setError(recentResult.error);
      } else {
        setRecentViews(recentResult.data?.slice(0, 10) || []);
      }
    } catch (err) {
      setError("Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          margin: "1rem",
        }}
      >
        <h3>📊 Analytics</h3>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "1rem",
          backgroundColor: "#fee",
          borderRadius: "8px",
          margin: "1rem",
        }}
      >
        <h3>📊 Analytics</h3>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={fetchAnalytics} style={{ marginTop: "0.5rem" }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        margin: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3>📊 Page View Analytics</h3>
        <button
          onClick={fetchAnalytics}
          style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}
        >
          Refresh
        </button>
      </div>

      {counts && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h4>Page View Counts:</h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            {Object.entries(counts).map(([path, count]) => (
              <div
                key={path}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "white",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    color: "#2563eb",
                  }}
                >
                  {count}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#666" }}>{path}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recentViews.length > 0 && (
        <div>
          <h4>Recent Page Views:</h4>
          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              marginTop: "0.5rem",
            }}
          >
            {recentViews.map((view, index) => (
              <div
                key={view.id || index}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "white",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  marginBottom: "0.25rem",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                }}
              >
                <span>{view.path}</span>
                <span style={{ color: "#666" }}>
                  {new Date(view.viewed_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
