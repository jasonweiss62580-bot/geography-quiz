import { useNavigate } from 'react-router-dom';
import styles from './HomeScreen.module.css';

const TOPICS = [
  {
    id: 'us-states',
    emoji: '🗺️',
    title: 'US States',
    sub: 'Learn all 50 states and their capitals',
    available: true,
  },
  {
    id: 'world-countries',
    emoji: '🌍',
    title: 'World Countries',
    sub: 'Explore countries and capitals worldwide',
    available: true,
  },
];

export function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className={styles.wrapper}>
      <div className={styles.hero}>
        <span className={styles.heroEmoji}>🌎</span>
        <h1 className={styles.heroTitle}>Carlthorp Geography Coach</h1>
        <p className={styles.heroSub}>Pick a topic to start learning!</p>
      </div>
      <div className={styles.cards}>
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            className={`${styles.card} ${!topic.available ? styles.disabled : ''}`}
            onClick={() => {
              if (!topic.available) return;
              if (topic.id === 'world-countries') navigate('/world');
              else navigate(`/topic/${topic.id}/mode`);
            }}
            disabled={!topic.available}
          >
            <span className={styles.cardEmoji}>{topic.emoji}</span>
            <p className={styles.cardTitle}>{topic.title}</p>
            <p className={styles.cardSub}>{topic.sub}</p>
            {!topic.available && <span className={styles.comingSoon}>Coming Soon</span>}
          </button>
        ))}
      </div>
      <p className={styles.credit}>Designed by The Weiss Crew</p>
    </div>
  );
}
