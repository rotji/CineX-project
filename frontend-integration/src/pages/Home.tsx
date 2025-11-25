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

        <h1>Welcome to CineX - Crowdfunding Platform for Creatives</h1>
        <p className={styles.subtitle}>A blockchain-powered platform where creatives collaborate through Co-EP rotating funding pools.</p>
        <div className={styles.ctaButtons}>
          <Link to="/pool-create" className={styles.ctaPrimary + ' ' + styles.ctaLarge}>
            Create a Co-EP Pool
          </Link>
        </div>
        <div className={styles.ctaButtons}>
          <Link to="/coep-pools" className={styles.ctaSecondary}>
            Explore Co-EP Pools
          </Link>
        </div>
      </section>

      <section className={styles.overview}>
        <div className={styles.overviewContent}>
          <h2>What is CineX?</h2>
          <p>
            CineX is a revolutionary platform that connects creatives and entertainment professionals through collaborative funding pools, leveraging the power of blockchain technology to create a transparent, efficient, and community-driven ecosystem. Our Co-EP (Cooperative Esusu Pool) system enables filmmakers to support each other through rotating funding cycles, inspired by the Nigerian Esusu cooperative model.
          </p>
        </div>
      </section>

      <section className={styles.featured}>
        <h2>How Co-EP Works</h2>
        <div className={styles.overviewContent}>
          <ol>
            <li><strong>Create or Join a Pool:</strong> Filmmakers come together to form a cooperative funding pool</li>
            <li><strong>Contribute Regularly:</strong> Each member commits to contributing a set amount per rotation cycle</li>
            <li><strong>Rotating Funding:</strong> Members take turns receiving the pooled funds for their projects</li>
            <li><strong>Transparent Verification:</strong> All transactions are recorded on the Stacks blockchain</li>
          </ol>
        </div>
      </section>
      <Testimonials />
    </div>
  );
};

export default Home;
