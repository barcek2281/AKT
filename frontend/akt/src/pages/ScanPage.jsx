import React, { useState, useRef, useEffect } from "react";
import "../styles/ScanPage.css";

const ScanPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
    } catch (err) {
      setError('Ошибка при запуске камеры: ' + err.message);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
          {isStreaming ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="camera-preview"
            />
          ) : (
            <img 
              src="https://i.ibb.co/mzWHZLP/plant.png" 
              alt="Plant" 
              className="plant-preview" 
            />
          )}
          <div className="scanner-frame">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
            <div className="scan-line"></div>
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="button-container">
          {!isStreaming ? (
            <button 
              className="camera-button"
              onClick={startCamera}
            >
              Включить камеру
            </button>
          ) : (
            <button 
              className="camera-button stop"
              onClick={stopCamera}
            >
              Выключить камеру
            </button>
          )}

          <button 
            className={`scan-button ${isScanning ? 'scanning' : ''}`}
            onClick={handleScan}
            disabled={isScanning || !isStreaming}
          >
            {isScanning ? 'Сканирование...' : 'Сканировать'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanPage;
