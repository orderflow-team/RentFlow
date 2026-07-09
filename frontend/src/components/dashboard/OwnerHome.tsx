'use client';

import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';

export function OwnerHome() {
  const { profile } = useAuth();
  const name = (profile?.firstName || '').split(' ')[0];

  return (
    <div>
      <PageHeader title={`Welcome, ${name}.`} subtitle="Your properties and financial overview" />
      <Card>Owner portal home is coming soon.</Card>
    </div>
  );
}
