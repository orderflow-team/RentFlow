'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ApiError } from '@/lib/errors';
import styles from '@/components/auth/AuthForm.module.css';

const DEMO_ACCOUNTS = [
  { label: 'Manager', email: 'manager@demo.local' },
  { label: 'Tenant', email: 'tenant@demo.local' },
  { label: 'Owner', email: 'owner@demo.local' },
];
const DEMO_PASSWORD = 'Demo@1234';

export default function LoginPage() {
  const { login, requestOtp, verifyOtp } = useAuth();
  const router = useRouter();
  const [method, setMethod] = useState<'password' | 'otp'>('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);

  function afterAuth(roles: string[]) {
    router.push(roles.length > 1 ? '/dashboard/select-role' : '/dashboard');
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email.trim(), password);
      afterAuth(res.user.roles);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setOtpSending(true);
    try {
      await requestOtp(phone.trim());
      setOtpSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not send OTP');
    } finally {
      setOtpSending(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyOtp(phone.trim(), code.trim());
      afterAuth(res.user.roles);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
  }

  return (
    <AuthLayout>
      <Link href="/" className={styles.logo}>
        <span className={styles.mark}>RF</span> RentFlow
      </Link>
      <h1 className={styles.heading}>Welcome back</h1>
      <p className={styles.sub}>
        Sign in to your account · <Link href="/signup">Create one</Link>
      </p>

      {error && <div className={styles.errorMsg}>{error}</div>}

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${method === 'password' ? styles.tabActive : ''}`}
          onClick={() => { setMethod('password'); setError(''); }}
        >
          Password
        </button>
        <button
          type="button"
          className={`${styles.tab} ${method === 'otp' ? styles.tabActive : ''}`}
          onClick={() => { setMethod('otp'); setError(''); }}
        >
          Phone / OTP
        </button>
      </div>

      {method === 'password' && (
        <form onSubmit={handlePasswordSubmit}>
          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" loading={loading} style={{ width: '100%' }}>
            Sign in
          </Button>
        </form>
      )}

      {method === 'otp' && !otpSent && (
        <form onSubmit={handleSendOtp}>
          <Input
            label="Mobile number"
            type="tel"
            placeholder="+91 98765 43210"
            required
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Button type="submit" loading={otpSending} style={{ width: '100%' }}>
            Send OTP
          </Button>
        </form>
      )}

      {method === 'otp' && otpSent && (
        <form onSubmit={handleVerifyOtp}>
          <p className={styles.sub} style={{ marginBottom: '1rem' }}>Code sent to {phone}.</p>
          <Input
            label="6-digit code"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            required
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button type="submit" loading={loading} style={{ width: '100%' }}>
            Verify &amp; sign in
          </Button>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button type="button" className={styles.backLink} onClick={() => { setOtpSent(false); setCode(''); setError(''); }}>
              ← Use a different number
            </button>
          </div>
        </form>
      )}

      {method === 'password' && (
        <div className={styles.demoBox}>
          <span className={styles.demoLabel}>Auto-fill Demo Roles</span>
          <div className={styles.demoRow}>
            {DEMO_ACCOUNTS.map((acc) => (
              <button key={acc.email} type="button" className={styles.demoBtn} onClick={() => fillDemo(acc.email)}>
                {acc.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.footerLink}>
        <Link href="/admin/login">Admin access</Link>
      </div>
    </AuthLayout>
  );
}
