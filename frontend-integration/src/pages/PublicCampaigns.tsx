import React from 'react';
import CampaignList from '../components/dashboard/CampaignList';

const PublicCampaigns: React.FC = () => (
  <div style={{padding:'2rem 1rem', maxWidth:1200, margin:'0 auto'}}>
    <h1>Funding Campaigns</h1>
    <CampaignList />
  </div>
);

export default PublicCampaigns;
