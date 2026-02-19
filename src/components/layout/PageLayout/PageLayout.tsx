import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PageLayout.module.css';

interface PageLayoutProps {
  title: string;
  showBack?: boolean;
  children: ReactNode;
  headerRight?: ReactNode;
}

export function PageLayout({ title, showBack = true, children, headerRight }: PageLayoutProps) {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        {showBack && (
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            ← Back
          </button>
        )}
        <h1 className={styles.title}>{title}</h1>
        {headerRight}
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
