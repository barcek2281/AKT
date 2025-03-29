import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import DashboardPage from './pages/DashboardPage';
import DetailsPage from './pages/DetailsPage';
import AccountPage from './pages/AccountPage';
import PlantDetailsPage from './pages/PlantDetailsPage';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/details" element={<DetailsPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/details/:id" element={<PlantDetailsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 