import { useEffect, useRef, useState } from "react";
import "./Gallery.css";
import { useParams } from "react-router-dom";
import BackButton from "../backButton/backButton";

const formatEventTitle = (slug) => {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "tedx") return "TEDx";
      if (lower === "ai") return "AI";
      if (lower === "oist") return "OIST";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export default function AsymmetricScrollingGallery() {
  const leftColumnRef = useRef(null);
  const centerColumnRef = useRef(null);
  const rightColumnRef = useRef(null);
  const { eventName } = useParams();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch images for the specific event
  useEffect(() => {
    fetch(`/eventImg/${eventName}/index.json`)
      .then((response) => response.json())
      .then((data) => setImages(data))
      .catch((error) => console.error("Error loading images:", error));
  }, [eventName]);

  // Lightbox keyboard and scroll management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  const renderColumn = (columnIndex) => {
    if (!images.length) return null;

    const columnImages = images.filter((_, index) => index % 3 === columnIndex);

    return columnImages.map((image, index) => {
      let height = "medium";
      if (columnIndex !== 1) {
        height =
          index % 3 === 0 ? "tall" : index % 3 === 1 ? "small" : "medium";
      }

      const imageSrc = `/eventImg/${eventName}/${image}`;

      return (
        <div
          key={`${columnIndex}-${index}`}
          className={`gallery-item ${height}`}
          role="button"
          tabIndex={0}
          aria-label={`View full image ${columnIndex * 12 + index + 1}`}
          onClick={() => setSelectedImage(imageSrc)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setSelectedImage(imageSrc);
            }
          }}
        >
          <img
            src={imageSrc}
            alt={`${formatEventTitle(eventName)} photo ${index + 1}`}
            className="gallery-image"
            loading="lazy"
            decoding="async"
          />
        </div>
      );
    });
  };

  return (
    <>
      <BackButton textDisplay={true} top="15px" left="20px" filter="invert(1)" />
      <div id="galleryContainer" className="gallery-container">
        <h1 className="gallery-title">{formatEventTitle(eventName)}</h1>
        <div className="gallery-grid">
          <div ref={leftColumnRef} className="gallery-column">
            {renderColumn(0)}
          </div>
          <div ref={centerColumnRef} className="gallery-column">
            {renderColumn(1)}
          </div>
          <div ref={rightColumnRef} className="gallery-column">
            {renderColumn(2)}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div
          className="gallery-lightbox-overlay"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <button
            className="gallery-lightbox-close"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image preview"
          >
            &times;
          </button>
          <div
            className="gallery-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="gallery-lightbox-img"
            />
          </div>
        </div>
      )}
    </>
  );
}
