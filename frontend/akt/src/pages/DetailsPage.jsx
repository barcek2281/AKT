import React, { useState } from 'react';
import '../styles/DetailsPage.css';

const DetailsPage = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="details-page">
      <div className="details-header">
        <h1>Plant Details</h1>
      </div>

      <div className="plant-image-container">
        <img 
          src="https://i.ibb.co/mzWHZLP/plant.png" 
          alt="Wild Stone Plant" 
          className="plant-image"
        />
      </div>

      <div className="plant-info">
        <div className="plant-title">
          <div className="plant-icon">🌿</div>
          <h2>Wild Stone Plant</h2>
        </div>
        <p className="plant-description">
          Plants are predominantly photosynthetic eukaryotes, forming the kingdom Plantae. They are characterized by their ability to produce their own food through photosynthesis...
        </p>

        <div className="plant-stats">
          <div className="stat-item">
            <div className="stat-icon">🌱</div>
            <div className="stat-label">Type</div>
            <div className="stat-value">Shrub</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">💧</div>
            <div className="stat-label">Humidity</div>
            <div className="stat-value">125%</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">☀️</div>
            <div className="stat-label">Atmosphere</div>
            <div className="stat-value">Sunny</div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🏠</div>
            <div className="stat-label">Inhouse</div>
            <div className="stat-value">Yes</div>
          </div>
        </div>

        <button className="view-more-button" onClick={() => setIsModalOpen(true)}>View More</button>
      </div>
        {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h2>Wild Stone Plant - More Details</h2>
            <p>Here you can add more detailed information about the plant, its care, and other characteristics.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPage;
