'use client';

import { useAuth } from '@/context/AuthContext';
import { PageHeader } from '@/components/layout/PageHeader';
import { ComingSoonCard } from '@/components/layout/ComingSoon';

export function OwnerHome() {
  const { profile } = useAuth();
  const name = (profile?.firstName || '').split(' ')[0];

  return (
    <div>
      <PageHeader title={`Welcome, ${name}.`} subtitle="Your properties and financial overview" />
      <ComingSoonCard note="Owner portal home is coming soon" />
    </div>
  );
}
