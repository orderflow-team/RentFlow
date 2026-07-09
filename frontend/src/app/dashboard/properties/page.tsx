'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { useAuth } from '@/context/AuthContext';
import { isStaffRole, isOwnerRole } from '@/lib/roles';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { EmptyState, Loading } from '@/components/ui/Table';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { AddPropertyModal } from '@/components/properties/AddPropertyModal';
import type { Paginated, Property } from '@/types/api';
import filterStyles from '@/components/ui/FilterBar.module.css';
import styles from './page.module.css';

export default function PropertiesPage() {
  const { roles, activeRole } = useAuth();
  const role = activeRole || roles[0];
  const canAdd = isStaffRole(role) || isOwnerRole(role);

  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['properties', status, search],
    queryFn: () => {
      const params = new URLSearchParams({ limit: '50' });
      if (status) params.set('status', status);
      if (search) params.set('search', search);
      return apiGet<Paginated<Property>>(`/properties?${params.toString()}`);
    },
  });

  const properties = data?.data || [];

  return (
    <div>
      <PageHeader
        title="Properties"
        subtitle="Manage your property portfolio"
        action={canAdd ? <Button size="sm" onClick={() => setModalOpen(true)}>+ Add Property</Button> : undefined}
      />
      <div className={filterStyles.bar}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="UNDER_MAINTENANCE">Under Maintenance</option>
        </select>
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading ? (
        <Loading />
      ) : properties.length ? (
        <div className={styles.grid}>
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      ) : (
        <EmptyState message={`No properties found.${canAdd ? ' Click "Add Property" to get started.' : ''}`} />
      )}

      {modalOpen && <AddPropertyModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
