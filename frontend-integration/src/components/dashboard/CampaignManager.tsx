import React, { useEffect, useState } from 'react';
import { createCineXServices } from '../../services';
import type { Campaign, PaginatedResponse, ServiceResponse } from '../../types';

const CampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyCampaigns = async () => {
      setLoading(true);
      setError(null);
      try {
        const services = createCineXServices(null); // TODO: pass userSession if needed
        const res: ServiceResponse<PaginatedResponse<Campaign>> = await services.crowdfunding.getCampaigns();
        // TODO: Filter campaigns by current user if needed
        setCampaigns(res.data?.items || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };
    fetchMyCampaigns();
  }, []);

  if (loading) return <div>Loading your campaigns...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!campaigns.length) return <div>No campaigns found.</div>;

  return (
    <div>
      {campaigns.map(c => (
        <div key={c.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p>Goal: {c.targetAmount}</p>
          <p>Status: {c.status}</p>
          {/* TODO: Add edit/view actions */}
        </div>
      ))}
    </div>
  );
};

export default CampaignManager;
