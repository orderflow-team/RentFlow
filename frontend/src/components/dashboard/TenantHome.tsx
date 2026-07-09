'use client';

import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { LeaseCard } from './LeaseCard';
import { InvoicesTable } from './InvoicesTable';
import { MaintenanceSection } from './MaintenanceSection';
import { DocumentsSection } from './DocumentsSection';

export function TenantHome() {
  const { profile } = useAuth();
  const name = (profile?.firstName || '').split(' ')[0];

  return (
    <div>
      <PageHeader title={`Welcome, ${name}.`} subtitle="Your rental portal" />
      <LeaseCard />
      <InvoicesTable />
      <MaintenanceSection />
      <DocumentsSection />
    </div>
  );
}
