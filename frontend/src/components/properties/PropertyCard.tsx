import Link from 'next/link';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { fileUrl } from '@/lib/api-client';
import type { Property } from '@/types/api';
import styles from './PropertyCard.module.css';

export function PropertyCard({ property }: { property: Property }) {
  const cover = fileUrl(property.images?.[0]?.url);

  return (
    <Link href={`/dashboard/properties/${property.id}`} className={styles.card}>
      {cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt={property.name} className={styles.img} />
      ) : (
        <div className={styles.imgPlaceholder} />
      )}
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
