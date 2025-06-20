import { useDispatch } from "react-redux";
import { setCurrentStep } from "../../store/parksSlice";
import { usePageTracker } from "../../hooks/trackingHooks";
import type { AppDispatch } from "../../store/store";
import { LandingMetrics } from "../LandingMetrics";
import Earth3D from "../3d-components/Earth3D";
import { TypeAnimation } from "react-type-animation";

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
          <h1>
            park{" "}
            <TypeAnimation
              sequence={["Ranker", 2000, "rankr", 8000]}
              speed={1}
              deletionSpeed={1}
              repeat={Infinity}
              cursor={true}
              className="typing-text"
            />
          </h1>
          <p>get your true ranked list for u.s. national parks</p>
          <button onClick={handleStart} className="start-button">
            start ranking
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
