import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState, useEffect } from "react";
import { HomeIcon, ReloadIcon } from "@radix-ui/react-icons";
import html2canvas from "html2canvas";
import { setCurrentStep, resetState } from "../../store/parksSlice";
import type { RootState } from "../../types/reduxTypes";
import type { AppDispatch } from "../../store/store";
import type { Park } from "../../data/parks";
import { ThemeToggle } from "../ThemeToggle";

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [copySuccess, setCopySuccess] = useState(false);
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
    const resultsContainer =
      document.querySelector<HTMLElement>(".results-container");
    if (!resultsContainer) return;

    // Create a clone of the container for manipulation
    const clone = resultsContainer.cloneNode(true) as HTMLElement;
    clone.style.width = "800px"; // Fixed width for consistent sharing
    clone.style.maxWidth = "800px";
    clone.style.margin = "0 auto";
    clone.style.padding = "2rem";
    clone.style.backgroundColor = isDarkMode ? "#1a1a1a" : "#ffffff";
    document.body.appendChild(clone);

    // Handle all images in the clone
    const images = clone.querySelectorAll("img");
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve) => {
          img.crossOrigin = "anonymous";
          // Ensure images are loaded before capture
          if (img.complete) {
            resolve(null);
          } else {
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null);
          }
        });
      })
    );

    // Adjust hero section for sharing
    const heroSection = clone.querySelector(".hero-section");
    if (heroSection) {
      (heroSection as HTMLElement).style.margin = "0 auto 2rem";
      (heroSection as HTMLElement).style.width = "100%";
      (heroSection as HTMLElement).style.maxWidth = "600px";
    }

    // Adjust hero image for sharing
    const heroImage = clone.querySelector(".hero-image");
    if (heroImage) {
      (heroImage as HTMLElement).style.width = "100%";
      (heroImage as HTMLElement).style.maxWidth = "400px";
    }

    // Adjust rankings list for sharing
    const rankingsList = clone.querySelector(".rankings-list");
    if (rankingsList) {
      (rankingsList as HTMLElement).style.display = "grid";
      (rankingsList as HTMLElement).style.gridTemplateColumns =
        "repeat(2, 1fr)";
      (rankingsList as HTMLElement).style.gap = "1rem";
      (rankingsList as HTMLElement).style.width = "100%";
      (rankingsList as HTMLElement).style.maxWidth = "600px";
      (rankingsList as HTMLElement).style.margin = "0 auto";
    }

    // Adjust ranking items for sharing
    const rankingItems = clone.querySelectorAll(".ranking-item");
    rankingItems.forEach((item) => {
      (item as HTMLElement).style.width = "100%";
      (item as HTMLElement).style.maxWidth = "280px";
      (item as HTMLElement).style.margin = "0 auto";
    });

    // Adjust park images in ranking items
    const parkImages = clone.querySelectorAll(".ranking-item .park-image");
    parkImages.forEach((img) => {
      (img as HTMLElement).style.width = "70px";
      (img as HTMLElement).style.aspectRatio = "2/3";
    });

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
        logging: false,
        onclone: (clonedDoc) => {
          // Additional adjustments if needed
          const clonedContainer = clonedDoc.querySelector(".results-container");
          if (clonedContainer) {
            (clonedContainer as HTMLElement).style.transform = "none";
          }
        },
      });

      // Clean up the clone
      document.body.removeChild(clone);

      canvas.toBlob(
        async (blob) => {
          if (!blob) return;

          const file = new File([blob], "my-park-rankings.png", {
            type: "image/png",
          });

          if (
            navigator.share &&
            navigator.canShare &&
            navigator.canShare({ files: [file] })
          ) {
            try {
              await navigator.share({
                title: "My National Park Rankings",
                text: "Check out my national park rankings!",
                files: [file],
              });
            } catch (err) {
              console.error("Error sharing:", err);
              // Fallback to download
              downloadImage(blob);
            }
          } else {
            downloadImage(blob);
          }
        },
        "image/png",
        1.0
      );
    } catch (err) {
      console.error("Error generating image:", err);
      document.body.removeChild(clone);
    }
  };

  const downloadImage = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-park-rankings.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
