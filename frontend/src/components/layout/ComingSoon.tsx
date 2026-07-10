import { PageHeader } from './PageHeader';
import styles from './ComingSoon.module.css';

export function ComingSoonCard({ note }: { note?: string }) {
  return (
    <div className={styles.card}>
      <div className={styles.orb}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
          <circle cx="12" cy="12" r="3.5" />
        </svg>
      </div>
      <div className={styles.title}>{note || 'This view is on its way'}</div>
      <p className={styles.text}>We&rsquo;re crafting this experience right now. It will land here in Phase 2.</p>
      <span className={styles.pill}>
        <span className={styles.pillDot} /> In development
      </span>
    </div>
  );
}

export function ComingSoon({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <ComingSoonCard note={`${title} is coming soon`} />
    </div>
  );
}
