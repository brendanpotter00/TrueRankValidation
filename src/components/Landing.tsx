import { useDispatch } from "react-redux";
import { setCurrentStep } from "../store/parksSlice";
import { usePageTracker } from "../hooks/trackingHooks";
import type { AppDispatch } from "../store/store";
import Earth3D from "./Earth3D";
import { LandingMetrics } from "./LandingMetrics";

export const Landing = () => {
  const dispatch = useDispatch<AppDispatch>();

  usePageTracker("/landing", true);

  const handleStart = () => {
    dispatch(setCurrentStep("selection"));

    // Smooth scroll to selection section after state update
    setTimeout(() => {
      const selectionSection = document.querySelector(".selection-container");
      if (selectionSection) {
        selectionSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <div>
      <div className="landing-container">
        <div className="landing-content">
          <h1>National Park Ranker</h1>
          <p>Get your true ranked list for U.S. National Parks</p>
          <button onClick={handleStart} className="start-button">
            Start Ranking
          </button>
        </div>
        <div className="landing-earth">
          <Earth3D />
        </div>
      </div>
      <LandingMetrics />
    </div>
  );
};
