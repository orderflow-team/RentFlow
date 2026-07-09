'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { ApiError } from '@/lib/errors';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      router.push(res.user.roles.length > 1 ? '/dashboard/select-role' : '/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Admin access</h1>
          <p>Sign in with your administrator credentials</p>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="adminEmail">Email address</label>
            <input id="adminEmail" type="email" placeholder="admin@company.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label htmlFor="adminPassword">Password</label>
            <input
              id="adminPassword"
              type="password"
              placeholder="Enter admin password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" loading={loading} style={{ width: '100%' }}>
            Sign in as admin
          </Button>
        </form>

        <div className={styles.demoBox}>
          <strong>Auto-fill Demo Credentials</strong>
          <button
            type="button"
            className={styles.demoBtn}
            onClick={() => {
              setEmail('admin@demo.local');
              setPassword('Demo@1234');
            }}
          >
            Admin Role
          </button>
        </div>

        <div className={styles.footerLinks}>
          <Link href="/login">← Back to user login</Link>
        </div>
      </div>
    </div>
  );
}
