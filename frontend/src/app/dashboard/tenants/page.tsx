'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import type { Paginated, TenantRecord } from '@/types/api';
import filterStyles from '@/components/ui/FilterBar.module.css';

export default function TenantsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tenants'],
    queryFn: () => apiGet<Paginated<TenantRecord>>('/tenants?limit=100'),
  });

  const q = search.trim().toLowerCase();
  const tenants = (data?.data || []).filter((t) => {
    const matchesSearch =
      !q ||
      `${t.firstName} ${t.lastName}`.toLowerCase().includes(q) ||
      (t.email || '').toLowerCase().includes(q) ||
      (t.phone || '').includes(q);
    return matchesSearch && (!status || t.status === status);
  });

  return (
    <div>
      <PageHeader title="Tenants" subtitle={`${data?.meta.total ?? '—'} residents across your portfolio`} />

      <div className={filterStyles.bar}>
        <input placeholder="Search name, email, or phone..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ minWidth: 240 }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="FORMER">Former</option>
          <option value="PROSPECTIVE">Prospective</option>
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <EmptyState message="Could not load tenants right now. Please try again." />
      ) : tenants.length ? (
        <Table headers={['Name', 'Email', 'Phone', 'Status', 'Documents', 'Added']}>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td>{t.firstName} {t.lastName}</td>
              <td>{t.email || '—'}</td>
              <td>{t.phone || '—'}</td>
              <td>
                <Tag color={statusTagColor(t.status)}>{t.status || '—'}</Tag>
              </td>
              <td>{t.documents?.length ? `${t.documents.length} on file` : '—'}</td>
              <td>{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState message={q || status ? 'No tenants match your filters.' : 'No tenants yet — they appear here once leases are created.'} />
      )}
    </div>
  );
}
