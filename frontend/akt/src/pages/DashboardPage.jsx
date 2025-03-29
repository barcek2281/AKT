import React from 'react';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  const plants = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      image: "https://i.ibb.co/mzWHZLP/plant.png",
      humidity: "125%",
      light: "Sunny",
      temperature: "90"
    },
    {
      id: 2,
      name: "Fiddle Leaf Fig",
      image: "https://i.ibb.co/mzWHZLP/plant.png",
      humidity: "125%",
      light: "Sunny",
      temperature: "90"
    }
  ];

  const relatedPlants = [
    {
      id: 1,
      name: "Alberiya garden plant",
      description: "Plants are predominantly...",
      image: "https://i.ibb.co/mzWHZLP/plant.png",
      price: "25.55",
      humidity: "125%",
      light: "Sunny",
      temperature: "90"
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="user-greeting">
          <h1>Hi Gargi!</h1>
          <p>Good morning</p>
        </div>
        <button className="menu-button">
          <i className="fas fa-bars"></i>
        </button>
      </div>

      <div className="environment-filter">
        <button className="filter-button active">Indoor</button>
        <button className="filter-button">Outdoor</button>
        <button className="filter-button">Both</button>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>My Plants</h2>
          <button className="view-all">View all</button>
        </div>
        
        <div className="plants-grid">
          {plants.map(plant => (
            <div key={plant.id} className="plant-card">
              <img src={plant.image} alt={plant.name} className="plant-image" />
              <div className="plant-stats">
                <div className="stat">
                  <span className="stat-icon">💧</span>
                  <span className="stat-value">{plant.humidity}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">☀️</span>
                  <span className="stat-value">{plant.light}</span>
                </div>
                <div className="stat">
                  <span className="stat-icon">🌡️</span>
                  <span className="stat-value">{plant.temperature}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Related Plants</h2>
        </div>
        
        <div className="related-plants">
          {relatedPlants.map(plant => (
            <div key={plant.id} className="related-plant-card">
              <div className="plant-info">
                <h3>{plant.name}</h3>
                <p>{plant.description}</p>
                <div className="plant-stats">
                  <div className="stat">
                    <span className="stat-icon">💧</span>
                    <span className="stat-value">{plant.humidity}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">☀️</span>
                    <span className="stat-value">{plant.light}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-icon">🌡️</span>
                    <span className="stat-value">{plant.temperature}</span>
                  </div>
                </div>
                <div className="price">£{plant.price}</div>
              </div>
              <img src={plant.image} alt={plant.name} className="plant-image" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
