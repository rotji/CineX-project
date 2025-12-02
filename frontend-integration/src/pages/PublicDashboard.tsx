import React from 'react';
import CampaignList from '../components/dashboard/CampaignList';
import PoolList from '../components/dashboard/PoolList';
import InvestmentTracker from '../components/dashboard/InvestmentTracker';
import Notifications from '../components/dashboard/Notifications';
import ProfileManager from '../components/dashboard/ProfileManager';

const PublicDashboard: React.FC = () => {
  return (
    <div>
      <h1>Public User Dashboard</h1>
      <section>
        <h2>Funding Campaigns</h2>
        <CampaignList />
      </section>
      <section>
        <h2>Private Funding Pools</h2>
        <PoolList />
      </section>
      <section>
        <h2>My Investments</h2>
        <InvestmentTracker />
      </section>
      <section>
        <h2>Notifications</h2>
        <Notifications />
      </section>
      <section>
        <h2>Profile</h2>
        <ProfileManager />
      </section>
    </div>
  );
};

export default PublicDashboard;
