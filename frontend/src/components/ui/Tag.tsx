import styles from './Tag.module.css';

type TagColor = 'green' | 'yellow' | 'red' | 'blue' | 'gray';

export function Tag({ color, children }: { color: TagColor; children: React.ReactNode }) {
  return <span className={`${styles.tag} ${styles[color]}`}>{children}</span>;
}

export function statusTagColor(status: string | undefined): TagColor {
  switch (status) {
    case 'ACTIVE':
    case 'PAID':
    case 'COMPLETED':
    case 'OCCUPIED':
      return 'green';
    case 'PENDING':
    case 'SUBMITTED':
    case 'UNDER_MAINTENANCE':
    case 'MAINTENANCE':
    case 'AVAILABLE_SOON':
      return 'yellow';
    case 'OVERDUE':
    case 'TERMINATED':
    case 'CANCELLED':
    case 'FORMER':
      return 'red';
    case 'IN_PROGRESS':
    case 'ACKNOWLEDGED':
      return 'blue';
    default:
      return 'gray';
  }
}
