import React from 'react';
import './CypherGallery.css';

const CypherGallery = ({ images }) => {
  const renderColumn = (columnIndex) => {
    if (!images || !images.length) return null;
    const columnImages = images.filter((_, index) => index % 3 === columnIndex);

    return columnImages.map((image, index) => {
      let height = "medium";
      if (columnIndex !== 1) {
        height = index % 3 === 0 ? "tall" : index % 3 === 1 ? "small" : "medium";
      }

      return (
        <div
          key={`${columnIndex}-${index}`}
          className={`cypher-gallery-item ${height}`}
        >
          <img
            src={image}
            alt={`Cypher winner ${columnIndex * 3 + index + 1}`}
            className="cypher-gallery-image"
            loading="lazy"
            decoding="async"
          />
          <div className="cypher-gallery-overlay"></div>
        </div>
      );
    });
  };

  return (
    <div className="cypher-gallery-grid">
      <div className="cypher-gallery-column">
        {renderColumn(0)}
      </div>
      <div className="cypher-gallery-column">
        {renderColumn(1)}
      </div>
      <div className="cypher-gallery-column">
        {renderColumn(2)}
      </div>
    </div>
  );
};

export default CypherGallery;
