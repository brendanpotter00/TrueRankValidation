import "../styles/components/HowItWorksModal.css";

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal = ({ isOpen, onClose }: HowItWorksModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>How Our Ranking Algorithm Works</h2>
          <button className="modal-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <section className="algorithm-section">
            <h3>Elo-Style Ranking System</h3>
            <p>
              Our ranking algorithm uses an Elo-inspired scoring system that
              combines multiple performance metrics to create fair,
              comprehensive park rankings based on community input.
            </p>
          </section>

          <section className="algorithm-section">
            <h3>Scoring Components</h3>
            <div className="scoring-components">
              <div className="score-component">
                <h4>Base Score</h4>
                <p>
                  <strong>Appearances × 50</strong>
                </p>
                <p>Parks get points for appearing in user rankings</p>
              </div>

              <div className="score-component">
                <h4>Position Bonus</h4>
                <p>
                  <strong>Max(0, (63 - Average Position) × 10)</strong>
                </p>
                <p>Higher rankings earn more bonus points</p>
              </div>

              <div className="score-component">
                <h4>Achievement Bonuses</h4>
                <div className="bonus-list">
                  <p>
                    <strong>First Place:</strong> 500 points per #1 finish
                  </p>
                  <p>
                    <strong>Top 3:</strong> 250 points per top-3 finish
                  </p>
                  <p>
                    <strong>Top 5:</strong> 100 points per top-5 finish
                  </p>
                  <p>
                    <strong>Top 10:</strong> 20 points per top-10 finish
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="algorithm-section">
            <h3>Final Score Formula</h3>
            <div className="formula">
              <p>
                <strong>
                  Elo Score = Base Score + Position Bonus + Achievement Bonuses
                </strong>
              </p>
            </div>
            <p>
              This system rewards both popularity (appearances) and quality
              (high rankings), ensuring that consistently well-ranked parks rise
              to the top.
            </p>
          </section>

          <section className="algorithm-section">
            <h3>What You See</h3>
            <div className="info-list">
              <p>
                <strong>Elo Score:</strong> The calculated ranking score
              </p>
              <p>
                <strong>Top 3 Finishes:</strong> How many times ranked in
                positions 1-3
              </p>
              <p>
                <strong>Visits:</strong> Total appearances in all user rankings
              </p>
            </div>
          </section>

          <section className="algorithm-section">
            <h3>Why This Works</h3>
            <div className="benefits-list">
              <p>
                <strong>Popularity:</strong> Parks mentioned frequently get
                recognition
              </p>
              <p>
                <strong>Quality:</strong> Parks ranked highly get significant
                bonuses
              </p>
              <p>
                <strong>Consistency:</strong> Parks that consistently rank well
                accumulate higher scores
              </p>
              <p>
                <strong>Fairness:</strong> No single metric dominates the
                ranking
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
