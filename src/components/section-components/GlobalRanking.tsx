import { usePageTracker } from "../../hooks/trackingHooks";
import { useGlobalRankings } from "../../hooks/useGlobalRankings";

export const GlobalRanking = () => {
  usePageTracker("/global-ranking", true);
  const {
    top10,
    mostLiked,
    mostVisited,
    totalVotes,
    totalParks,
    activeUsers,
    isLoading,
    error,
  } = useGlobalRankings();

  // Debug logging
  console.log("GlobalRanking data:", {
    top10: top10.length,
    mostLiked: mostLiked?.name,
    mostVisited: mostVisited?.name,
    totalVotes,
    totalParks,
    activeUsers,
    isLoading,
    error,
  });

  if (isLoading) {
    return (
      <div className="global-ranking-container">
        <div className="global-ranking-content">
          <h1>Global Rankings</h1>
          <p>Loading community rankings...</p>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="global-ranking-container">
        <div className="global-ranking-content">
          <h1>Global Rankings</h1>
          <p>Error loading rankings: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="global-ranking-container">
      <div className="global-ranking-content">
        <h1>Global Rankings</h1>
        <p>
          Discover how national parks rank globally based on community votes.
        </p>

        <div className="global-ranking-stats">
          <div className="stat-card">
            <h3>Total Votes</h3>
            <p className="stat-number">{totalVotes.toLocaleString()}</p>
          </div>
          <div className="stat-card">
            <h3>Parks Ranked</h3>
            <p className="stat-number">{totalParks}</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p className="stat-number">{activeUsers.toLocaleString()}</p>
          </div>
        </div>

        {mostLiked && mostVisited && (
          <div className="global-ranking-stats">
            <div className="stat-card featured">
              <h3>Most Liked</h3>
              <p className="stat-park-name">{mostLiked.name}</p>
              <p className="stat-number">
                {mostLiked.votes?.toLocaleString() || 0} votes
              </p>
            </div>
            <div className="stat-card featured">
              <h3>Most Visited</h3>
              <p className="stat-park-name">{mostVisited.name}</p>
              <p className="stat-number">
                {mostVisited.visits?.toLocaleString() || 0} visits
              </p>
            </div>
          </div>
        )}

        <div className="global-ranking-list">
          <h2>Top National Parks</h2>
          <p>Global rankings based on community preferences and Elo scoring.</p>

          {top10.length > 0 ? (
            <div className="rankings-list">
              {top10.map((park, index) => {
                console.log(
                  `Park ${index + 1}:`,
                  park.name,
                  "Elo:",
                  park.eloScore,
                  "Votes:",
                  park.votes,
                  "Visits:",
                  park.visits
                );
                return (
                  <div key={park.id} className="ranking-item">
                    <div className="ranking-position">#{index + 1}</div>
                    <h3 className="park-name">{park.name}</h3>
                    <div className="ranking-stats">
                      <div className="stat">
                        <span className="stat-label">Elo Score:</span>
                        <span className="stat-value">
                          {park.eloScore?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Votes:</span>
                        <span className="stat-value">
                          {park.votes?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Visits:</span>
                        <span className="stat-value">
                          {park.visits?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="placeholder-content">
              <p>No rankings available yet.</p>
              <p>Be the first to create a ranking!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
