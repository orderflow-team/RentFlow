import Link from 'next/link';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import type { Property } from '@/types/api';
import styles from './PropertyCard.module.css';

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/dashboard/properties/${property.id}`} className={styles.card}>
      <div className={styles.imgPlaceholder} />
      <div className={styles.body}>
        <h4 className={styles.name}>{property.name}</h4>
        <p className={styles.address}>
          {property.address}, {property.city}
        </p>
        <div className={styles.meta}>
          {property.buildingCount ?? 0} buildings ·{' '}
          <Tag color={statusTagColor(property.status)}>{property.status || '—'}</Tag>
        </div>
      </div>
    </Link>
  );
}
