import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { HomeIcon, ReloadIcon } from "@radix-ui/react-icons";
import html2canvas from "html2canvas";
import { setCurrentStep, resetState } from "../store/parksSlice";
import type { RootState } from "../store/types";
import type { AppDispatch } from "../store/store";
import type { Park } from "../data/parks";

export const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [copySuccess, setCopySuccess] = useState(false);
  const currentStep = useSelector(
    (state: RootState) => state.parks.currentStep
  );
  const rankedParks = useSelector(
    (state: RootState) => state.parks.rankedParks
  );

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

    // Force every <img> in the clone to be CORS-safe
    resultsContainer.querySelectorAll("img").forEach((img) => {
      img.crossOrigin = "anonymous";
    });

    const canvas = await html2canvas(resultsContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: false, // don't allow tainting—drop any un-CORSed pixels
      backgroundColor: "#ffffff",
      proxy: "https://your-cors-proxy.com/",

      // onclone runs before the snapshot, so you can tweak the cloned DOM if needed
      onclone: (doc) => {
        const hero = doc.querySelector<HTMLElement>(".hero-section");
        if (hero) {
          const bg = getComputedStyle(hero).backgroundImage;
          if (bg && bg !== "none") {
            // replace CSS background with an <img> in the clone
            const url = bg.slice(5, -2);
            hero.style.backgroundImage = "";
            const cover = doc.createElement("img");
            cover.src = url;
            cover.crossOrigin = "anonymous";
            cover.style.width = "100%";
            cover.style.height = "auto";
            cover.style.objectFit = "cover";
            cover.style.position = "absolute";
            cover.style.top = "0";
            cover.style.left = "0";
            cover.style.zIndex = "-1";
            hero.appendChild(cover);
          }
        }
      },
      imageTimeout: 15000, // give big images time to load
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], "my-park-rankings.png", {
        type: "image/png",
      });
      // share or fallback to download…
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "My National Park Rankings",
          text: "Check out my national park rankings!",
          files: [file],
        });
      } else {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, "image/png");
  };

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
        </div>
      )}
    </header>
  );
};
