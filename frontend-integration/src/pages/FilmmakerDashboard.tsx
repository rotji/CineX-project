import React from 'react';
import CampaignManager from '../components/dashboard/CampaignManager';
import PoolManager from '../components/dashboard/PoolManager';
import PortfolioManager from '../components/dashboard/PortfolioManager';
import EndorsementStatus from '../components/dashboard/EndorsementStatus';
import RevenueTracker from '../components/dashboard/RevenueTracker';
import Notifications from '../components/dashboard/Notifications';

const FilmmakerDashboard: React.FC = () => {
  return (
    <div>
      <h1>Filmmaker Dashboard</h1>
      <section>
        <h2>My Campaigns</h2>
        <CampaignManager />
      </section>
      <section>
        <h2>My Funding Pools</h2>
        <PoolManager />
      </section>
      <section>
        <h2>Portfolio</h2>
        <PortfolioManager />
      </section>
      <section>
        <h2>Endorsements & Verification</h2>
        <EndorsementStatus />
      </section>
      <section>
        <h2>Revenue</h2>
        <RevenueTracker />
      </section>
      <section>
        <h2>Notifications</h2>
        <Notifications />
      </section>
    </div>
  );
};

export default FilmmakerDashboard;
