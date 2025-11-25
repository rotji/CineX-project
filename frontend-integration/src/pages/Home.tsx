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

        <h1>Fund Your Creative Vision Together</h1>
        <p className={styles.subtitle}>
          Join forces with fellow filmmakers through rotating funding pools. 
          Take turns supporting each other's projects on the blockchain.
        </p>
        
        <div className={styles.ctaButtons}>
          <Link to="/pool-create" className={styles.ctaPrimary + ' ' + styles.ctaLarge}>
            🎬 Start a Funding Pool
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
          <h2>How CineX Works</h2>
          <p>
            CineX brings filmmakers together through <strong>Co-EP Pools</strong> - a revolutionary way to fund creative projects. 
            Instead of going it alone, you join a group of creators who support each other through rotating funding cycles.
          </p>
        </div>
      </section>

      <section className={styles.featured}>
        <h2>Three Simple Steps</h2>
        <div className={styles.overviewContent}>
          <ol>
            <li>
              <strong>🚀 Create or Join a Pool:</strong> Start your own funding pool or join an existing one with other filmmakers. 
              Set the bond amount and member limit.
            </li>
            <li>
              <strong>💰 Contribute Together:</strong> Each member commits to contribute a set amount each rotation cycle. 
              Your contributions are secured on the Stacks blockchain.
            </li>
            <li>
              <strong>🎯 Take Turns Getting Funded:</strong> Members rotate to receive the pooled funds for their projects. 
              Everyone gets their turn to bring their vision to life.
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
