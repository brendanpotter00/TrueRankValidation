import html2canvas from "html2canvas";

export async function generateShareImage(isDarkMode: boolean): Promise<File> {
  console.log("[shareImage] Starting image generation, dark mode:", isDarkMode);

  const resultsContainer =
    document.querySelector<HTMLElement>(".results-container");
  if (!resultsContainer) {
    console.error("[shareImage] Results container not found in DOM");
    throw new Error("Results container not found");
  }
  console.log("[shareImage] Found results container");

  // Create a clone of the container for manipulation
  const clone = resultsContainer.cloneNode(true) as HTMLElement;
  console.log("[shareImage] Created container clone");

  // Create a wrapper div for the background
  const wrapper = document.createElement("div");
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
    wrapper.appendChild(darkOverlay);
  }

  // Move the clone into the wrapper
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  console.log("[shareImage] Added wrapper to DOM");

  // Adjust the clone container
  clone.style.width = "100%";
  clone.style.maxWidth = "900px";
  clone.style.margin = "0 auto";
  clone.style.padding = "0";

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
  }

  // Handle all images in the clone
  const images = clone.querySelectorAll("img");
  console.log("[shareImage] Found images to process:", images.length);

  try {
    await Promise.all(
      Array.from(images).map((img) => {
        return new Promise((resolve) => {
          img.crossOrigin = "anonymous";
          if (img.complete) {
            console.log("[shareImage] Image already loaded:", img.src);
            resolve(null);
          } else {
            console.log("[shareImage] Waiting for image to load:", img.src);
            img.onload = () => {
              console.log("[shareImage] Image loaded:", img.src);
              resolve(null);
            };
            img.onerror = (err) => {
              console.error("[shareImage] Image failed to load:", img.src, err);
              resolve(null);
            };
          }
        });
      })
    );
    console.log("[shareImage] All images processed");

    // Also load the background image
    console.log("[shareImage] Loading background image");
    const bgImage = new Image();
    bgImage.crossOrigin = "anonymous";
    bgImage.src = "/topo.jpeg";
    await new Promise((resolve) => {
      if (bgImage.complete) {
        console.log("[shareImage] Background image already loaded");
        resolve(null);
      } else {
        bgImage.onload = () => {
          console.log("[shareImage] Background image loaded");
          resolve(null);
        };
        bgImage.onerror = (err) => {
          console.error("[shareImage] Background image failed to load:", err);
          resolve(null);
        };
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

    console.log("[shareImage] Starting html2canvas conversion");
    const canvas = await html2canvas(wrapper, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "transparent",
      logging: false,
      onclone: (clonedDoc) => {
        console.log("[shareImage] Canvas clone created");
        const clonedWrapper = clonedDoc.querySelector("div");
        if (clonedWrapper) {
          (clonedWrapper as HTMLElement).style.transform = "none";
        }
      },
    });
    console.log("[shareImage] Canvas created successfully");

    // Clean up the wrapper
    document.body.removeChild(wrapper);
    console.log("[shareImage] Wrapper removed from DOM");

    return new Promise((resolve, reject) => {
      console.log("[shareImage] Converting canvas to blob");
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            console.error("[shareImage] Failed to create blob from canvas");
            reject(new Error("Failed to create blob from canvas"));
            return;
          }
          console.log("[shareImage] Blob created, size:", blob.size);
          const file = new File([blob], "my-park-rankings.png", {
            type: "image/png",
          });
          console.log("[shareImage] File created successfully");
          resolve(file);
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    console.error("[shareImage] Error during image generation:", err);
    document.body.removeChild(wrapper);
    throw err;
  }
}
