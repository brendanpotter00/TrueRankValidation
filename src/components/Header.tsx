import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { HomeIcon } from "@radix-ui/react-icons";
import { setCurrentStep } from "../store/parksSlice";
import type { RootState } from "../store/types";
import type { AppDispatch } from "../store/store";

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentStep = useSelector(
    (state: RootState) => state.parks.currentStep
  );

  const handleGoHome = useCallback(() => {
    dispatch(setCurrentStep("selection"));
    window.history.pushState({ step: "selection" }, "", "?step=selection");
  }, [dispatch]);

  // Don't show header on the initial landing/selection page
  if (currentStep === "selection") {
    return null;
  }

  return (
    <header className="app-header">
      <button
        onClick={handleGoHome}
        className="nav-button home-button"
        title="Go to Selection"
      >
        <HomeIcon />
      </button>
    </header>
  );
};
