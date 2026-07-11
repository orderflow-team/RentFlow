'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/lib/api-client';
import { PageHeader, SectionHeading } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { formatINR } from '@/lib/currency';
import type { DashboardSummary, Invoice } from '@/types/api';
import styles from './StaffHome.module.css';

export function StaffHome() {
  const { profile } = useAuth();
  const name = (profile?.firstName || '').split(' ')[0];
  const companyName = profile?.company?.name || 'your company';

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['reports-dashboard'],
    queryFn: () => apiGet<DashboardSummary>('/reports/dashboard'),
  });

  const { data: invoicesRes, isLoading: invLoading } = useQuery({
    queryKey: ['recent-invoices'],
    queryFn: () => apiGet<{ data: Invoice[] }>('/invoices?limit=5'),
  });

  const occ = stats?.occupancy || {};
  const fin = stats?.financial || {};
  const invoices = invoicesRes?.data || [];

  return (
    <div>
      <PageHeader title={`Hello, ${name}.`} subtitle={`Portfolio overview for ${companyName}`} />
      <div className={styles.statsGrid}>
        <StatCard label="Total Units" value={statsLoading ? '—' : occ.totalUnits ?? 0} sub="Across portfolio" />
        <StatCard label="Occupied" value={statsLoading ? '—' : occ.occupiedUnits ?? 0} sub={`${occ.occupancyRate ?? 0}% rate`} />
        <StatCard label="Vacant" value={statsLoading ? '—' : occ.vacantUnits ?? 0} sub="Available" />
        <StatCard label="Maintenance" value={statsLoading ? '—' : occ.maintenanceUnits ?? 0} sub="Under repair" />
        <StatCard label="Collected" value={statsLoading ? '—' : formatINR(fin.totalCollected)} sub="Revenue" />
        <StatCard label="Occupancy Rate" value={statsLoading ? '—%' : `${occ.occupancyRate ?? 0}%`} sub={`${occ.occupiedUnits ?? 0} of ${occ.totalUnits ?? 0} rented`} />
      </div>

      <SectionHeading>Recent activity</SectionHeading>
      {invLoading ? (
        <Loading />
      ) : invoices.length ? (
        <Table headers={['Receipt', 'Amount', 'Status', 'Unit', 'Tenant']}>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.invoiceNumber}</td>
              <td>{formatINR(inv.totalAmount)}</td>
              <td>
                <Tag color={statusTagColor(inv.status)}>{inv.status || '—'}</Tag>
              </td>
              <td>{inv.unit || '—'}</td>
              <td>{inv.tenant || '—'}</td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState message="No recent activity." />
      )}
    </div>
  );
}
