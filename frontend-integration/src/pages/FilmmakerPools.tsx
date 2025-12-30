import React from 'react';
import PoolManager from '../components/dashboard/PoolManager';

const FilmmakerPools: React.FC = () => (
  <div style={{padding:'2rem 1rem', maxWidth:1200, margin:'0 auto'}}>
    <h1>My Funding Pools</h1>
    <PoolManager />
  </div>
);

export default FilmmakerPools;
