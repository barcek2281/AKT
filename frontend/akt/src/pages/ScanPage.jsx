import React, { useState } from "react";
import "../styles/ScanPage.css";

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Здесь будет логика сканирования
    setTimeout(() => {
      setIsScanning(false);
    }, 3000);
  };

  return (
    <div className="scan-page">
      <div className="scan-content">
        <h1>Сканирование растения</h1>
        <p className="scan-description">
          Поместите растение в рамку и нажмите кнопку "Сканировать"
        </p>
        
        <div className={`scanner-container ${isScanning ? 'scanning' : ''}`}>
          <div className="scanner-frame">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
            <div className="scan-line"></div>
          </div>
          <img 
            src="https://i.ibb.co/mzWHZLP/plant.png" 
            alt="Plant" 
            className="plant-preview" 
          />
        </div>

        <button 
          className={`scan-button ${isScanning ? 'scanning' : ''}`}
          onClick={handleScan}
          disabled={isScanning}
        >
          {isScanning ? 'Сканирование...' : 'Сканировать'}
        </button>
      </div>
    </div>
  );
};

export default ScanPage;
