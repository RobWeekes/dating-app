import { Link } from 'react-router-dom';
import styles from './UnderConstruction.module.css';

function UnderConstruction() {
  return (
    <div className={styles['under-construction-page']}>
      <div className={styles['construction-container']}>
        <div className={styles['construction-icon']}>🔨</div>
        <h1>Coming Soon</h1>
        <p className={styles['construction-message']}>
          This feature is currently under construction. We're working hard to bring you something amazing!
        </p>
        <div className={styles['construction-progress']}>
          <div className={styles['progress-bar']}>
            <div className={styles['progress-fill']}></div>
          </div>
          <p className={styles['progress-text']}>Your patience means everything to us</p>
        </div>
        <Link to="/" className="btn btn-primary btn-lg mt-lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default UnderConstruction;
