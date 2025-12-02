import React from 'react';
import VerificationRequests from '../components/dashboard/VerificationRequests';
import ProofOfWork from '../components/dashboard/ProofOfWork';
import EarningsTracker from '../components/dashboard/EarningsTracker';
import Notifications from '../components/dashboard/Notifications';
import ProfileManager from '../components/dashboard/ProfileManager';

const EndorserDashboard: React.FC = () => {
  return (
    <div>
      <h1>Endorser Dashboard</h1>
      <section>
        <h2>Verification Requests</h2>
        <VerificationRequests />
      </section>
      <section>
        <h2>My Proof of Work</h2>
        <ProofOfWork />
      </section>
      <section>
        <h2>Earnings</h2>
        <EarningsTracker />
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

export default EndorserDashboard;
