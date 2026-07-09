'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Sidebar } from '@/components/layout/Sidebar';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, roles, activeRole } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isSelectRolePage = pathname === '/dashboard/select-role';

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!isSelectRolePage && roles.length > 1 && !activeRole) {
      router.replace('/dashboard/select-role');
    }
  }, [isLoading, isAuthenticated, roles.length, activeRole, isSelectRolePage, router]);

  if (isLoading || !isAuthenticated) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (isSelectRolePage) {
    return <>{children}</>;
  }

  if (roles.length > 1 && !activeRole) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </>
  );
}
