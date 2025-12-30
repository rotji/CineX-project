import React from 'react';
import CampaignManager from '../components/dashboard/CampaignManager';

const FilmmakerCampaigns: React.FC = () => (
  <div style={{padding:'2rem 1rem', maxWidth:1200, margin:'0 auto'}}>
    <h1>My Campaigns</h1>
    <CampaignManager />
  </div>
);

export default FilmmakerCampaigns;
