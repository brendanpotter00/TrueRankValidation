import React from "react";
import "./BackgroundCarousel.css";

interface BackgroundCarouselProps {
  duration?: number; // Duration in seconds, default 30s
  objectFit?: "cover" | "contain"; // How images should fill their containers
}

export const BackgroundCarousel: React.FC<BackgroundCarouselProps> = ({
  duration = 100,
  objectFit = "cover",
}) => {
  // Dynamically import all images from src/pictures/ with multiple patterns to catch all formats
  const imageModules = import.meta.glob(
    "../pictures/*.{jpg,jpeg,png,JPG,JPEG,PNG}",
    {
      eager: true,
      as: "url",
    }
  );

  // Extract image URLs from the import result
  const imageUrls = Object.values(imageModules);

  // Debug: Log the number of images found
  // console.log(`BackgroundCarousel: Found ${imageUrls.length} images`);
  // console.log("Image URLs:", imageUrls);

  // Duplicate the images for seamless infinite loop
  const duplicatedImages = [...imageUrls, ...imageUrls];

  // Calculate dynamic values based on number of images
  const numImages = imageUrls.length;
  const slideWidth = 100 / (numImages / 3); // Each slide takes 1/numImages of viewport width
  const trackWidth = 200; // 200% to hold original + duplicate images
  const animationDistance = -100; // Move 100% to cycle through all original images

  const containerStyle = {
    "--anim-duration": `${duration}s`,
    "--object-fit": objectFit,
    "--slide-width": `${slideWidth}%`,
    "--track-width": `${trackWidth}%`,
    "--animation-distance": `${animationDistance}%`,
  } as React.CSSProperties;

  return (
    <div className="background-carousel" style={containerStyle}>
      <div className="carousel-track">
        {duplicatedImages.map((imageUrl, index) => (
          <div key={index} className="carousel-slide">
            <img
              src={imageUrl}
              alt={`Background ${index + 1}`}
              className="carousel-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
