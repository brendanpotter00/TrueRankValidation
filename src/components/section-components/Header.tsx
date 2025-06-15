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

    // Also load the background image
    const bgImage = new Image();
    bgImage.crossOrigin = "anonymous";
    bgImage.src = "/topo.jpeg";
    await new Promise((resolve) => {
      if (bgImage.complete) {
        resolve(null);
      } else {
        bgImage.onload = () => resolve(null);
        bgImage.onerror = () => resolve(null);
      }
    });

    // Adjust hero section for sharing
    const heroSection = clone.querySelector(".hero-section");
    if (heroSection) {
      (heroSection as HTMLElement).style.margin = "0 auto 2rem";
      (heroSection as HTMLElement).style.width = "100%";
      (heroSection as HTMLElement).style.maxWidth = "700px";
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
      (rankingsList as HTMLElement).style.boxSizing = "border-box";
      (rankingsList as HTMLElement).style.justifyContent = "center";
      // The rest of the grid styling is now handled by CSS.
    }

    // Adjust ranking items for sharing
    const rankingItems = clone.querySelectorAll(".ranking-item");
    rankingItems.forEach((item) => {
      (item as HTMLElement).style.width = "100%";
      (item as HTMLElement).style.maxWidth = "250px";
      (item as HTMLElement).style.margin = "0 auto";
      (item as HTMLElement).style.display = "flex";
      (item as HTMLElement).style.alignItems = "center";
      (item as HTMLElement).style.gap = "0.75rem";
      (item as HTMLElement).style.padding = "0.75rem";
    });

    // Adjust park images in ranking items
    const parkImages = clone.querySelectorAll(".ranking-item .park-image");
    parkImages.forEach((img) => {
      (img as HTMLElement).style.width = "70px";
      (img as HTMLElement).style.aspectRatio = "2/3";
    });

    try {
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
          });

          // Debug logging for share API support
          console.log("Share API support:", {
            hasShare: !!navigator.share,
            hasCanShare: !!navigator.canShare,
            canShareFile: navigator.canShare
              ? navigator.canShare({ files: [file] })
              : false,
            fileSize: file.size,
            fileType: file.type,
          });

          // Try to share using Web Share API
          if (navigator.share) {
            try {
              // For iOS devices, we need to ensure the blob is properly created
              if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
                // Create a new blob with explicit type
                const newBlob = new Blob([blob], { type: "image/png" });
                const newFile = new File([newBlob], "my-park-rankings.png", {
                  type: "image/png",
                  lastModified: new Date().getTime(),
                });

                await navigator.share({
                  title: "My National Park Rankings",
                  text: "Check out my national park rankings!",
                  files: [newFile],
                });
              } else {
                await navigator.share({
                  title: "My National Park Rankings",
                  text: "Check out my national park rankings!",
                  files: [file],
                });
              }
            } catch (err) {
              console.error("Share API error:", err);
              // If sharing fails, fall back to download
              downloadImage(blob);
            }
          } else {
            console.log(
              "Web Share API not supported, falling back to download"
            );
            downloadImage(blob);
          }
        },
        "image/png",
        1.0
      );
    } catch (err) {
      console.error("Error generating image:", err);
      // Ensure wrapper is cleaned up even if there's an error
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
      // Ensure the link is visible and clickable on mobile
      link.style.display = "block";
      link.style.position = "fixed";
      link.style.top = "50%";
      link.style.left = "50%";
      link.style.transform = "translate(-50%, -50%)";
      link.style.padding = "1rem";
      link.style.background = "var(--primary-color)";
      link.style.color = "white";
      link.style.borderRadius = "0.5rem";
      link.style.textDecoration = "none";
      link.style.zIndex = "9999";
      link.textContent = "Download Rankings";

      // Add click handler to clean up
      const cleanup = () => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      };

      link.onclick = (e) => {
        e.preventDefault();
        cleanup();
        // Trigger download
        link.click();
      };

      document.body.appendChild(link);

      // Auto-cleanup after 5 seconds if not clicked
      setTimeout(cleanup, 5000);
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
