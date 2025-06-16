import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState, useEffect } from "react";
import { HomeIcon, ReloadIcon } from "@radix-ui/react-icons";
import { setCurrentStep, resetState } from "../../store/parksSlice";
import type { RootState } from "../../types/reduxTypes";
import type { AppDispatch } from "../../store/store";
import type { Park } from "../../data/parks";
import { ThemeToggle } from "../ThemeToggle";
import { generateShareImage } from "../../utils/shareImage";

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareFile, setShareFile] = useState<File | null>(null);
  const currentStep = useSelector(
    (state: RootState) => state.parks.currentStep
  );
  const rankedParks = useSelector(
    (state: RootState) => state.parks.rankedParks
  );
  const isDarkMode = useSelector((state: RootState) => state.ui.isDarkMode);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light"
    );
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  // Pre-generate share image when results are shown
  useEffect(() => {
    if (currentStep === "results") {
      console.log("[Header] Starting share image generation...");
      generateShareImage(isDarkMode)
        .then((file) => {
          console.log("[Header] Share image generated successfully:", file);
          setShareFile(file);
        })
        .catch((err) => {
          console.error("[Header] Failed to pre-generate share image:", err);
          // Log additional context about the current state
          console.log("[Header] Current state:", {
            currentStep,
            isDarkMode,
            hasResultsContainer: !!document.querySelector(".results-container"),
            rankedParksCount: rankedParks.length,
          });
        });
    }
  }, [currentStep, isDarkMode, rankedParks.length]);

  const handleGoHome = useCallback(() => {
    dispatch(setCurrentStep("selection"));
    window.history.pushState({ step: "selection" }, "", "?step=selection");
  }, [dispatch]);

  const handleRestart = useCallback(() => {
    dispatch(resetState());
    // Add to browser history for back button support
    window.history.pushState({ step: "selection" }, "", "?step=selection");
  }, [dispatch]);

  const handleCopyRankings = async () => {
    const rankingsText = rankedParks
      .map((park: Park, index: number) => `${index + 1}. ${park.name}`)
      .join("\n");

    try {
      await navigator.clipboard.writeText(rankingsText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy rankings:", err);
    }
  };

  const handleShareRankings = async () => {
    console.log(
      "[Header] Share button clicked, shareFile state:",
      shareFile ? "exists" : "null"
    );
    if (!shareFile) {
      console.error("[Header] Share file not ready");
      return;
    }

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [shareFile] })
    ) {
      console.log("[Header] Using Web Share API");
      try {
        await navigator.share({
          title: "My National Park Rankings",
          text: "Check out my national park rankings!",
          files: [shareFile],
        });
        console.log("[Header] Share successful");
      } catch (err) {
        console.error("[Header] Error sharing:", err);
        // Fallback to download if share fails
        console.log("[Header] Falling back to download");
        const url = URL.createObjectURL(shareFile);
        const link = document.createElement("a");
        link.href = url;
        link.download = "my-park-rankings.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } else {
      console.log(
        "[Header] Web Share API not available, falling back to download"
      );
      // Fallback to download if Web Share API is not available
      const url = URL.createObjectURL(shareFile);
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-park-rankings.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Don't show header on the initial landing/selection page
  if (currentStep === "selection" || currentStep === "ranking") {
    return (
      <header className="app-header">
        <button
          onClick={handleGoHome}
          className="nav-button home-button"
          title="Go to Selection"
        >
          <HomeIcon />
        </button>
        <ThemeToggle />
      </header>
    );
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

      {currentStep === "results" && (
        <div className="header-right">
          <button
            onClick={handleRestart}
            className="nav-button restart-button"
            title="Start Over"
          >
            <ReloadIcon />
          </button>

          <button
            onClick={handleCopyRankings}
            className="nav-button copy-button"
            title="Copy rankings to clipboard"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copySuccess && <span className="copy-success">Copied!</span>}
          </button>

          <button
            onClick={handleShareRankings}
            className="nav-button share-button"
            title="Share rankings as image"
            disabled={!shareFile}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16,6 12,2 8,6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
          </button>
          <ThemeToggle />
        </div>
      )}
    </header>
  );
};
