'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { formatINR } from '@/lib/currency';
import type { Paginated, StaffLease } from '@/types/api';
import filterStyles from '@/components/ui/FilterBar.module.css';

export default function LeasesPage() {
  const [status, setStatus] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leases'],
    queryFn: () => apiGet<Paginated<StaffLease>>('/leases?limit=100'),
  });

  const leases = (data?.data || []).filter((l) => !status || l.status === status);

  return (
    <div>
      <PageHeader title="Leases" subtitle="Active and past rental contracts" />

      <div className={filterStyles.bar}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="DRAFT">Draft</option>
          <option value="EXPIRED">Expired</option>
          <option value="TERMINATED">Terminated</option>
          <option value="RENEWED">Renewed</option>
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <EmptyState message="Could not load leases right now. Please try again." />
      ) : leases.length ? (
        <Table headers={['Tenant', 'Flat', 'Building', 'Rent / month', 'Deposit', 'Start', 'End', 'Status']}>
          {leases.map((l) => (
            <tr key={l.id}>
              <td>{l.tenant ? `${l.tenant.firstName} ${l.tenant.lastName}` : '—'}</td>
              <td>{l.unit?.name || '—'}</td>
              <td>{l.unit?.building?.name || '—'}</td>
              <td>{formatINR(l.rentAmount)}</td>
              <td>{formatINR(l.depositAmount)}</td>
              <td>{new Date(l.startDate).toLocaleDateString()}</td>
              <td>{l.endDate ? new Date(l.endDate).toLocaleDateString() : 'Open'}</td>
              <td>
                <Tag color={statusTagColor(l.status)}>{l.status || '—'}</Tag>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState message={status ? 'No leases with this status.' : 'No leases yet.'} />
      )}
    </div>
  );
}
