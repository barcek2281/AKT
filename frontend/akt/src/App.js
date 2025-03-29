import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ScanPage from "./pages/ScanPage";
import DetailsPage from "./pages/DetailsPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import AccountPage from "./pages/AccountPage";
function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/details" element={<DetailsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </Router>
  );
}

export default App;
