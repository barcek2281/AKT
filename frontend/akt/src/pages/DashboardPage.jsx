import React from "react";

const DashboardPage = () => {
  return (
    <div className="page">
      <h2>Hi Gargi! 👋</h2>
      <p>Indoor | Outdoor | Both</p>

      <h3>My Plants</h3>
      <div className="plant-row">
        <div className="plant-card">🌱 Plant 1</div>
        <div className="plant-card">🌱 Plant 2</div>
      </div>

      <h3>Related Plants</h3>
      <div className="related">
        <div className="plant-card">
          Alberiya Garden Plant <br />
          <small>125% • Sunny • 90</small>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
