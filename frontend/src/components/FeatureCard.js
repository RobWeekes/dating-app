import styles from './FeatureCard.module.css';

function FeatureCard({ icon, title, description, link }) {
  return (
    <div className={styles['feature-card']}>
      <div className={styles['feature-icon']}>{icon}</div>
      <h3 className={styles['feature-title']}>{title}</h3>
      <p className={styles['feature-description']}>{description}</p>
      {link && (
        <a href={link} className={styles['feature-link']}>
          Learn more →
        </a>
      )}
    </div>
  );
}

export default FeatureCard;
