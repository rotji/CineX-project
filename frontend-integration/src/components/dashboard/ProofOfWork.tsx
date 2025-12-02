import React, { useEffect, useState } from 'react';
import { getEndorsements } from '../../services/verificationService';
import type { Endorsement } from '../../types';

const ProofOfWork: React.FC = () => {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TODO: Replace with actual user address/session
  const userAddress = '';

  useEffect(() => {
    const fetchEndorsements = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getEndorsements(userAddress);
        setEndorsements(res || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load endorsements');
      } finally {
        setLoading(false);
      }
    };
    fetchEndorsements();
  }, []);

  if (loading) return <div>Loading proof of work...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!endorsements.length) return <div>No proof of work found.</div>;

  return (
    <div>
      {endorsements.map(e => (
        <div key={e.id} style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
          <h3>Project: {e.projectId || 'N/A'}</h3>
          <p>By: {e.endorserName || e.endorser}</p>
          <p>Rating: {e.rating}</p>
          <p>Comment: {e.comment}</p>
          <p>Date: {new Date(e.timestamp).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default ProofOfWork;
