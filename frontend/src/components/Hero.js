import styles from './Hero.module.css';

function Hero({ title, subtitle, cta1Text, cta1Link, cta2Text, cta2Link, backgroundImage }) {
  return (
    <section className={styles.hero}>
      <div className={styles['hero-background']} style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}>
        <div className={styles['hero-overlay']}></div>
      </div>
      <div className={styles['hero-content']}>
        <h1 className={styles['hero-title']}>{title}</h1>
        <p className={styles['hero-subtitle']}>{subtitle}</p>
        <div className={styles['hero-actions']}>
          <a href={cta1Link} className="btn btn-primary btn-lg">
            {cta1Text}
          </a>
          {cta2Text && (
            <a href={cta2Link} className="btn btn-outline btn-lg">
              {cta2Text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
