'use client';

import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { Card } from '@/components/ui/Card';
import { formatINR } from '@/lib/currency';
import type { Lease } from '@/types/api';
import styles from './LeaseCard.module.css';

function ChecklistRow({ label, done }: { label: string; done: boolean }) {
  return (
    <div className={styles.checkRow}>
      <strong>{label}:</strong>{' '}
      {done ? <span className={styles.done}>✓ Done</span> : <span className={styles.pending}>⏳ Pending</span>}
    </div>
  );
}

export function LeaseCard() {
  const { data: lease, isLoading, isError } = useQuery({
    queryKey: ['tenant-me-lease'],
    queryFn: () => apiGet<Lease>('/tenants/me/lease'),
    retry: false,
  });

  return (
    <div className={styles.grid}>
      <div>
        <h3 className={styles.colTitle}>Your lease</h3>
        {isLoading && <Card>Loading...</Card>}
        {isError && <Card>No active lease.</Card>}
        {lease && (
          <Card>
            <h4 className={styles.unitName}>Unit {lease.unit?.name || '—'}</h4>
            <p className={styles.subtext}>
              {lease.unit?.building?.name}
              {lease.unit?.building?.name && lease.unit?.building?.property?.name ? ' · ' : ''}
              {lease.unit?.building?.property?.name}
            </p>
            <div className={styles.meta}>
              Rent: <strong>{formatINR(lease.rentAmount)}</strong> · {new Date(lease.startDate).toLocaleDateString()} —{' '}
              {lease.endDate ? new Date(lease.endDate).toLocaleDateString() : 'Open'}
            </div>
          </Card>
        )}
      </div>
      <div>
        <h3 className={styles.colTitle}>Lease Checklists</h3>
        <Card>
          {lease?.leaseLifecycle ? (
            <>
              <ChecklistRow label="Agreement Signed" done={lease.leaseLifecycle.moveInAgreementSigned} />
              <ChecklistRow label="Deposit Received" done={lease.leaseLifecycle.moveInDepositReceived} />
              <ChecklistRow label="KYC Completed" done={lease.leaseLifecycle.moveInKycCompleted} />
              <ChecklistRow label="Move-in Photos" done={lease.leaseLifecycle.moveInPhotosUploaded} />
              <ChecklistRow label="Key Handover" done={lease.leaseLifecycle.moveInKeyHandover} />
              <hr className={styles.divider} />
              <ChecklistRow label="Exit Inspection" done={lease.leaseLifecycle.moveOutInspection} />
              <ChecklistRow label="Key Return" done={lease.leaseLifecycle.moveOutKeyReturn} />
            </>
          ) : (
            <p className={styles.subtext}>No checklist tracking found.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
