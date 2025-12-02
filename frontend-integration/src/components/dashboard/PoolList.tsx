import React, { useEffect, useState } from 'react';
import { createCineXServices } from '../../services';
import type { CoEPPool, PaginatedResponse, ServiceResponse } from '../../types';

const PoolList: React.FC = () => {
  const [pools, setPools] = useState<CoEPPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPools = async () => {
      setLoading(true);
      setError(null);
      try {
        const services = createCineXServices(null); // TODO: pass userSession if needed
        const res: ServiceResponse<PaginatedResponse<CoEPPool>> = await services.coep.getPools();
        setPools(res.data?.items || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load pools');
      } finally {
        setLoading(false);
      }
    };
    fetchPools();
  }, []);

  if (loading) return <div>Loading pools...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!pools.length) return <div>No pools found.</div>;

  return (
    <div>
      {pools.map(pool => (
        <div key={pool.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <h3>{pool.name}</h3>
          <p>{pool.description}</p>
          <p>Members: {pool.currentMembers} / {pool.maxMembers}</p>
        </div>
      ))}
    </div>
  );
};

export default PoolList;
