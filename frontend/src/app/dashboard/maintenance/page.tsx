'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPatch } from '@/lib/api-client';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag } from '@/components/ui/Tag';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/errors';
import type { Paginated, MaintenanceRequest, Vendor } from '@/types/api';
import filterStyles from '@/components/ui/FilterBar.module.css';

function priorityColor(p: string) {
  if (p === 'URGENT' || p === 'HIGH') return 'red' as const;
  if (p === 'MEDIUM') return 'yellow' as const;
  return 'gray' as const;
}

const STATUS_OPTIONS = ['SUBMITTED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'];

function StatusCell({ request }: { request: MaintenanceRequest }) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const mutation = useMutation({
    mutationFn: (status: string) => apiPatch(`/maintenance/${request.id}/status`, { status }),
    onSuccess: () => {
      toast('Status updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
    },
    onError: (err) => toast(err instanceof ApiError ? err.message : 'Failed to update status', 'error'),
  });

  return (
    <select
      value={request.status}
      onChange={(e) => mutation.mutate(e.target.value)}
      disabled={mutation.isPending}
      style={{ padding: '0.35rem 0.6rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', fontSize: '0.8rem', background: 'var(--bg-card)' }}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  );
}

export default function MaintenancePage() {
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['maintenance'],
    queryFn: () => apiGet<Paginated<MaintenanceRequest>>('/maintenance?limit=100'),
  });
  const { data: vendors } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => apiGet<Vendor[]>('/vendors'),
  });

  const requests = (data?.data || []).filter((r) => (!status || r.status === status) && (!priority || r.priority === priority));

  return (
    <div>
      <PageHeader title="Maintenance" subtitle="All maintenance requests across your portfolio" />

      <div className={filterStyles.bar}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <EmptyState message="Could not load maintenance requests right now." />
      ) : requests.length ? (
        <Table headers={['Title', 'Flat', 'Tenant', 'Priority', 'Vendor', 'Status', 'Date']}>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.unit?.name || '—'}</td>
              <td>{r.tenant ? `${r.tenant.firstName} ${r.tenant.lastName}` : '—'}</td>
              <td>
                <Tag color={priorityColor(r.priority)}>{r.priority || '—'}</Tag>
              </td>
              <td>{r.vendor?.name || '—'}</td>
              <td>
                <StatusCell request={r} />
              </td>
              <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState message={status || priority ? 'No requests match your filters.' : 'No maintenance requests yet.'} />
      )}

      {vendors && vendors.length === 0 && !isLoading && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-faint)', marginTop: '0.5rem' }}>
          Tip: add vendors in the Vendors tab to assign them to requests.
        </p>
      )}
    </div>
  );
}
