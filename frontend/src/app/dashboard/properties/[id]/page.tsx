'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { Gallery } from '@/components/ui/Gallery';
import { BuildingsManager } from '@/components/properties/BuildingsManager';
import { useAuth } from '@/context/AuthContext';
import { isStaffRole, isOwnerRole } from '@/lib/roles';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Table';
import type { Property } from '@/types/api';
import styles from './page.module.css';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { roles, activeRole } = useAuth();
  const role = activeRole || roles[0];
  const canManage = isStaffRole(role) || isOwnerRole(role);

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => apiGet<Property>(`/properties/${id}`),
  });

  if (isLoading) return <Loading />;
  if (!property) return <Card>Property not found.</Card>;

  const managerInitials = property.manager
    ? `${property.manager.firstName?.[0] || ''}${property.manager.lastName?.[0] || ''}`.toUpperCase() || 'M'
    : '—';

  return (
    <div>
      <button className={styles.backLink} onClick={() => router.push('/dashboard/properties')}>
        ← Back to properties
      </button>
      <PageHeader title={property.name} subtitle="Buildings inside this property" />
      {property.images && property.images.length > 0 && <Gallery images={property.images} alt={property.name} />}
      <Card className={styles.managerCard}>
        <span className={styles.managerAvatar}>{managerInitials}</span>
        <div>
          <div className={styles.managerLabel}>Property manager</div>
          <div className={styles.managerName}>
            {property.manager ? (
              <>
                {property.manager.firstName} {property.manager.lastName}
                {property.manager.phone && <span className={styles.managerPhone}> · {property.manager.phone}</span>}
              </>
            ) : (
              'No manager assigned yet'
            )}
          </div>
        </div>
      </Card>
      <BuildingsManager propertyId={id} canManage={canManage} />
    </div>
  );
}
