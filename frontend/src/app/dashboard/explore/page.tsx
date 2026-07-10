'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiGet, fileUrl } from '@/lib/api-client';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmptyState, Loading } from '@/components/ui/Table';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { formatINR } from '@/lib/currency';
import type { DiscoveryProperty } from '@/types/api';
import filterStyles from '@/components/ui/FilterBar.module.css';
import styles from './page.module.css';

function rentLabel(p: DiscoveryProperty) {
  if (!p.rentRange) return 'Rent on request';
  if (p.rentRange.min === p.rentRange.max) return formatINR(p.rentRange.min);
  return `${formatINR(p.rentRange.min)} – ${formatINR(p.rentRange.max)}`;
}

export default function ExplorePage() {
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [availableSoon, setAvailableSoon] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['discovery', location, type, availableSoon],
    queryFn: () => {
      const params = new URLSearchParams();
      if (location.trim()) params.set('location', location.trim());
      if (type) params.set('type', type);
      if (availableSoon) params.set('isAvailableSoon', 'true');
      const qs = params.toString();
      return apiGet<DiscoveryProperty[]>(`/discovery/search${qs ? `?${qs}` : ''}`);
    },
  });

  const properties = data || [];

  return (
    <div>
      <PageHeader title="Explore Properties" subtitle="Browse available properties and see every detail before you decide" />

      <div className={filterStyles.bar}>
        <input placeholder="Search by city, area, or address..." value={location} onChange={(e) => setLocation(e.target.value)} style={{ minWidth: 240 }} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="APARTMENT_COMPLEX">Apartment Complex</option>
          <option value="SINGLE_FAMILY">Single Family</option>
          <option value="MULTI_FAMILY">Multi Family</option>
          <option value="COMMERCIAL">Commercial</option>
          <option value="MIXED_USE">Mixed Use</option>
        </select>
        <select value={availableSoon ? 'soon' : ''} onChange={(e) => setAvailableSoon(e.target.value === 'soon')}>
          <option value="">Available now &amp; soon</option>
          <option value="soon">Available soon only</option>
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <EmptyState message="Could not load properties right now. Please try again in a moment." />
      ) : properties.length ? (
        <div className={styles.grid}>
          {properties.map((p) => {
            const cover = fileUrl(p.images?.[0]?.url);
            const photoCount = p.images?.length || 0;
            return (
              <Link key={p.id} href={`/dashboard/explore/${p.id}`} className={styles.card}>
                <div className={styles.imgWrap}>
                  {cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={p.name} className={styles.img} />
                  )}
                  {photoCount > 1 && <span className={styles.photoCount}>📷 {photoCount}</span>}
                </div>
                <div className={styles.body}>
                  <h4 className={styles.name}>{p.name}</h4>
                  <p className={styles.address}>
                    {p.address}, {p.city}
                  </p>
                  <div className={styles.rent}>
                    {rentLabel(p)} <span className={styles.rentUnit}>/ month</span>
                  </div>
                  <div className={styles.meta}>
                    <span>
                      {p.unitsCount} unit{p.unitsCount === 1 ? '' : 's'}
                    </span>
                    <Tag color={statusTagColor(p.status)}>{p.status === 'AVAILABLE_SOON' ? 'AVAILABLE SOON' : p.status}</Tag>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <EmptyState message="No properties match your search yet. Try a different location or clear the filters." />
      )}
    </div>
  );
}
