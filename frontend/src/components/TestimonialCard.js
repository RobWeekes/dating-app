import styles from './TestimonialCard.module.css';

function TestimonialCard({ quote, author, matchedWith, image, rating }) {
  return (
    <div className={styles['testimonial-card']}>
      <div className={styles['testimonial-header']}>
        <div className={styles['testimonial-rating']}>
          {'⭐'.repeat(rating)}
        </div>
      </div>
      <p className={styles['testimonial-quote']}>"{quote}"</p>
      <div className={styles['testimonial-author']}>
        <img src={image} alt={author} className={styles['author-image']} />
        <div>
          <p className={styles['author-name']}>{author}</p>
          <p className={styles['matched-with']}>Matched with {matchedWith}</p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
