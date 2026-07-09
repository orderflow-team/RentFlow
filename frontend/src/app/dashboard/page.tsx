'use client';

import { useAuth } from '@/context/AuthContext';
import { isStaffRole, isOwnerRole, isTenantRole } from '@/lib/roles';
import { StaffHome } from '@/components/dashboard/StaffHome';
import { TenantHome } from '@/components/dashboard/TenantHome';
import { OwnerHome } from '@/components/dashboard/OwnerHome';

export default function DashboardHomePage() {
  const { roles, activeRole } = useAuth();
  const role = activeRole || roles[0];

  if (isTenantRole(role)) return <TenantHome />;
  if (isOwnerRole(role)) return <OwnerHome />;
  if (isStaffRole(role)) return <StaffHome />;
  return <StaffHome />;
}
