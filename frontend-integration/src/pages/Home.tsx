import React from 'react';
import handsLogo from '../assets/hands-together-logo.svg';
import { Link } from 'react-router-dom';
import styles from '../styles/pages/Home.module.css';
import Testimonials from '../components/Home/Testimonials';

const Home: React.FC = () => {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroLogoWrapper}>
          <img src={handsLogo} alt="Hands coming together" className={styles.heroLogo} />
        </div>

        <h1>Fund Your Creative Vision</h1>
        <p className={styles.subtitle}>
          Choose your path: Launch a solo crowdfunding campaign or join forces 
          with fellow creators through rotating funding pools.
        </p>
        
        <div className={styles.ctaButtons}>
          <Link to="/campaign-create" className={styles.ctaPrimary + ' ' + styles.ctaLarge}>
            🎬 Create Campaign
          </Link>
          <Link to="/pool-create" className={styles.ctaPrimary + ' ' + styles.ctaLarge}>
            🤝 Create Pool
          </Link>
        </div>
        <div className={styles.ctaButtons}>
          <Link to="/coep-pools" className={styles.ctaSecondary}>
            Browse Active Pools
          </Link>
        </div>
      </section>

      <section className={styles.overview}>
        <div className={styles.overviewContent}>
          <h2>Two Ways to Fund Your Project</h2>
          <p>
            CineX offers <strong>two powerful funding models</strong> to bring your creative vision to life.
          </p>
        </div>
      </section>

      <section className={styles.featured}>
        <h2>🎬 Option 1: Solo Campaign</h2>
        <div className={styles.overviewContent}>
          <p><strong>Perfect for independent creators with a specific project.</strong></p>
          <ol>
            <li><strong>Create Your Campaign:</strong> Set your funding goal, deadline, and project details</li>
            <li><strong>Share Widely:</strong> Promote to your audience and the CineX community</li>
            <li><strong>Receive Contributions:</strong> Backers support your project directly</li>
            <li><strong>Launch Your Project:</strong> Once funded, bring your vision to life</li>
          </ol>
        </div>

        <h2>🤝 Option 2: Co-EP Pool (Collaborative)</h2>
        <div className={styles.overviewContent}>
          <p><strong>Perfect for creators who want to support each other.</strong></p>
          <ol>
            <li>
              <strong>Create or Join a Pool:</strong> Form a group with fellow filmmakers. 
              Set the bond amount and member limit.
            </li>
            <li>
              <strong>Contribute Together:</strong> Each member commits to contribute a set amount each rotation cycle. 
              Your contributions are secured on the blockchain.
            </li>
            <li>
              <strong>Take Turns Getting Funded:</strong> Members rotate to receive the pooled funds for their projects. 
              Everyone gets their turn!
            </li>
          </ol>
        </div>
      </section>

      <section className={styles.overview}>
        <div className={styles.overviewContent}>
          <h2>Why Choose CineX?</h2>
          <div style={{ marginTop: '1.5rem' }}>
            <p><strong>🔒 Transparent & Secure:</strong> All transactions recorded on blockchain</p>
            <p><strong>🤝 Community-Driven:</strong> Filmmakers supporting filmmakers</p>
            <p><strong>⚡ Fair Rotation:</strong> Everyone gets equal opportunity</p>
            <p><strong>📊 Track Everything:</strong> See pool status and member contributions in real-time</p>
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
};

export default Home;
