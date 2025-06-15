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

    // Get all images and ensure they have crossOrigin set
    const images = clone.querySelectorAll("img");
    images.forEach((img) => {
      (img as HTMLImageElement).crossOrigin = "anonymous";
    });

    // Create a wrapper div for the background
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "-9999px";
    wrapper.style.left = "-9999px";
    wrapper.style.width = "1000px";
    wrapper.style.maxWidth = "1000px";
    wrapper.style.margin = "0 auto";
    wrapper.style.padding = "2rem";
    wrapper.style.backgroundImage = isDarkMode
      ? "linear-gradient(rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0.95)), url('/topo.jpeg')"
      : "linear-gradient(rgba(217, 212, 197, 0.858), rgba(217, 212, 197, 0.874)), url('/topo.jpeg')";
    wrapper.style.backgroundSize = "cover";
    wrapper.style.backgroundPosition = "center";
    wrapper.style.backgroundRepeat = "no-repeat";
    wrapper.style.backgroundColor = isDarkMode ? "#1a1a1a" : "transparent";
    wrapper.style.borderRadius = "1rem";
    wrapper.style.overflow = "hidden";
    wrapper.style.color = isDarkMode ? "#ffffff" : "var(--text-color)";
    wrapper.style.zIndex = "-1";

    // Add a subtle dark mode overlay to the content
    if (isDarkMode) {
      const darkOverlay = document.createElement("div");
      darkOverlay.style.position = "absolute";
      darkOverlay.style.top = "0";
      darkOverlay.style.left = "0";
      darkOverlay.style.right = "0";
      darkOverlay.style.bottom = "0";
      darkOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
      darkOverlay.style.pointerEvents = "none";
      darkOverlay.style.zIndex = "1";
      wrapper.appendChild(darkOverlay);
    }

    // Move the clone into the wrapper
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // Adjust the clone container
    clone.style.width = "100%";
    clone.style.maxWidth = "900px";
    clone.style.margin = "0 auto";
    clone.style.padding = "0";
    clone.style.position = "relative";
    clone.style.zIndex = "2";

    // Style rank numbers properly
    const rankNumbers = clone.querySelectorAll(".rank-number");
    rankNumbers.forEach((rank) => {
      (rank as HTMLElement).style.fontWeight = "bold";
      (rank as HTMLElement).style.fontSize = "1.5rem";
      (rank as HTMLElement).style.minWidth = "1.5625rem";
      (rank as HTMLElement).style.textAlign = "center";
      (rank as HTMLElement).style.color = "var(--primary-color)";
      (rank as HTMLElement).style.flexShrink = "0";
    });

    // Update text colors in the clone for dark mode
    if (isDarkMode) {
      const textElements = clone.querySelectorAll(".park-name, .hero-title");
      textElements.forEach((el) => {
        (el as HTMLElement).style.color = "#ffffff";
      });
      // Don't change rank number color in dark mode as it should stay primary color
    }

    try {
      // Wait for all images to load
      await Promise.all(
        Array.from(images).map((img) => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve(null);
            } else {
              img.onload = () => resolve(null);
              img.onerror = () => resolve(null);
            }
          });
        })
      );

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "transparent",
        logging: false,
        onclone: (clonedDoc) => {
          const clonedWrapper = clonedDoc.querySelector("div");
          if (clonedWrapper) {
            (clonedWrapper as HTMLElement).style.transform = "none";
            (clonedWrapper as HTMLElement).style.position = "relative";
            (clonedWrapper as HTMLElement).style.top = "0";
            (clonedWrapper as HTMLElement).style.left = "0";
          }
        },
      });

      // Clean up the wrapper immediately after capture
      if (document.body.contains(wrapper)) {
        document.body.removeChild(wrapper);
      }

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            console.error("Failed to create blob from canvas");
            return;
          }

          const file = new File([blob], "my-park-rankings.png", {
            type: "image/png",
            lastModified: new Date().getTime(),
          });

          try {
            // First try to share the file if supported
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: "My National Park Rankings",
                text: "Check out my national park rankings!",
                files: [file],
              });
            }
            // If file sharing isn't supported but text sharing is
            else if (navigator.share) {
              await navigator.share({
                title: "My National Park Rankings",
                text:
                  "Check out my national park rankings! " +
                  window.location.href,
              });
            }
            // Fall back to download if sharing isn't supported
            else {
              downloadImage(blob);
            }
          } catch (err) {
            console.error("Share error:", err);
            downloadImage(blob);
          }
        },
        "image/png",
        1.0
      );
    } catch (err) {
      console.error("Error generating image:", err);
      if (document.body.contains(wrapper)) {
        document.body.removeChild(wrapper);
      }
    }
  };

  const downloadImage = (blob: Blob) => {
    try {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "my-park-rankings.png";
      document.body.appendChild(link);

      // Trigger download immediately
      link.click();

      // Clean up after a short delay
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Error in downloadImage:", err);
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
