'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { roleLabel } from '@/lib/roles';
import { Card } from '@/components/ui/Card';
import styles from './page.module.css';

export default function SelectRolePage() {
  const { roles, setActiveRole } = useAuth();
  const router = useRouter();

  function choose(role: string) {
    setActiveRole(role);
    router.push('/dashboard');
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Choose how to continue</h1>
        <p>Your account has multiple roles. Pick one to enter its dashboard.</p>
      </div>
      <div className={styles.grid}>
        {roles.map((role) => (
          <Card key={role} onClick={() => choose(role)} className={styles.card}>
            <h4>{roleLabel(role)}</h4>
            <p>Continue as {roleLabel(role)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
