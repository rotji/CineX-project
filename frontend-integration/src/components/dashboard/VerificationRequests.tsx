import React, { useEffect, useState } from 'react';
import { createCineXServices } from '../../services';
import type { VerificationApplication } from '../../types';

const VerificationRequests: React.FC = () => {
  const [requests, setRequests] = useState<VerificationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const services = createCineXServices(null); // TODO: pass userSession if needed
        // TODO: Replace with actual service call for verification requests
        // const res: ServiceResponse<PaginatedResponse<VerificationApplication>> = await services.verification.getVerificationRequests();
        // setRequests(res.data?.items || []);
        setRequests([]); // Placeholder
      } catch (err: any) {
        setError(err.message || 'Failed to load verification requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div>Loading verification requests...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!requests.length) return <div>No verification requests found.</div>;

  return (
    <div>
      {requests.map(r => (
        <div key={r.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <h3>{r.name}</h3>
          <p>{r.bio}</p>
          <p>Status: {r.status}</p>
          {/* TODO: Add review/approve/reject actions */}
        </div>
      ))}
    </div>
  );
};

export default VerificationRequests;
