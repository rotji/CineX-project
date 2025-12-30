import CoEPPools from './pages/CoEPPools';
import EndorsementSystem from './pages/EndorsementSystem';
import AdminControls from './pages/AdminControls';
// import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Waitlist from './pages/Waitlist';
import PoolDetail from './pages/PoolDetail';
import PoolCreate from './pages/PoolCreate';
import CampaignCreate from './pages/CampaignCreate';
// Demo components (only loaded in development)
const isDev = import.meta.env.MODE === 'development';
let TransactionDemo: React.FC | undefined;
let EnhancedTransactionDemo: React.FC | undefined;
if (isDev) {
  TransactionDemo = require('./lib/TransactionDemo').TransactionDemo;
  EnhancedTransactionDemo = require('./lib/EnhancedTransactionDemo').EnhancedTransactionDemo;
}
import './App.css';
// Removed dashboard imports
import FilmmakerCampaigns from './pages/FilmmakerCampaigns';
import FilmmakerPools from './pages/FilmmakerPools';
import PublicCampaigns from './pages/PublicCampaigns';
import PublicPools from './pages/PublicPools';

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/campaign-create" element={<CampaignCreate />} />
          <Route path="/pool-detail/:poolId" element={<PoolDetail />} />
          <Route path="/pool-create" element={<PoolCreate />} />
          <Route path="/coep-pools" element={<CoEPPools />} />
          {/* Dashboards */}
          {/* Removed dashboard routes for deleted components */}
          {/* Dashboard subpages */}
          <Route path="/filmmaker/campaigns" element={<FilmmakerCampaigns />} />
          <Route path="/filmmaker/pools" element={<FilmmakerPools />} />
          <Route path="/public/campaigns" element={<PublicCampaigns />} />
          <Route path="/public/pools" element={<PublicPools />} />
          {/* Developer testing routes - only enabled in development mode */}
          {isDev && TransactionDemo && (
            <Route path="/dev/transaction-demo" element={<TransactionDemo />} />
          )}
          {isDev && EnhancedTransactionDemo && (
            <Route path="/dev/modal-demo" element={<EnhancedTransactionDemo />} />
          )}
          <Route path="/endorsement" element={<EndorsementSystem />} />
          <Route path="/admin" element={<AdminControls />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
