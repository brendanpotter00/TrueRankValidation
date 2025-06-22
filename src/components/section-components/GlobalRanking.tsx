import { usePageTracker } from "../../hooks/trackingHooks";

export const GlobalRanking = () => {
  usePageTracker("/global-ranking", true);

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
            <p className="stat-number">Coming Soon</p>
          </div>
          <div className="stat-card">
            <h3>Parks Ranked</h3>
            <p className="stat-number">63</p>
          </div>
          <div className="stat-card">
            <h3>Active Users</h3>
            <p className="stat-number">Coming Soon</p>
          </div>
        </div>

        <div className="global-ranking-list">
          <h2>Top National Parks</h2>
          <p>
            Global rankings will be displayed here based on community
            preferences.
          </p>
          <div className="placeholder-content">
            <p>This feature is coming soon!</p>
            <p>
              Users will be able to see how parks rank based on votes from the
              community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
