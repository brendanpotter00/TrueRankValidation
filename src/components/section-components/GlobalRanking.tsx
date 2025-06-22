import { useState } from "react";
import { usePageTracker } from "../../hooks/trackingHooks";
import { useGlobalRankings } from "../../hooks/useGlobalRankings";
import { HowItWorksModal } from "../HowItWorksModal";
import "../../styles/components/GlobalRanking.css";

export const GlobalRanking = () => {
  usePageTracker("/global-ranking", true);
  const [showModal, setShowModal] = useState(false);

  const {
    top20,
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
    top20: top20.length,
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
          <div className="ranking-title-section">
            <h2>Top 20 National Parks</h2>
            <p>
              Global rankings based on community preferences and Elo scoring.{" "}
              <a
                href="#"
                className="how-it-works-link"
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
              >
                How it works
              </a>
            </p>
          </div>

          {top20.length > 0 ? (
            <div className="rankings-list">
              {top20.map((park, index) => {
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
                          {Math.floor(park.eloScore || 0)?.toLocaleString() ||
                            0}
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

        <HowItWorksModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
        />
      </div>
    </div>
  );
};
