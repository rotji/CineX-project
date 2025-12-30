import React from 'react';
import PoolList from '../components/dashboard/PoolList';

const PublicPools: React.FC = () => (
  <div style={{padding:'2rem 1rem', maxWidth:1200, margin:'0 auto'}}>
    <h1>Private Funding Pools</h1>
    <PoolList />
  </div>
);

export default PublicPools;
