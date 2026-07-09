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

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        companyName: companyName.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Link href="/" className={styles.logo}>
        <span className={styles.mark}>RF</span> RentFlow
      </Link>
      <h1 className={styles.heading}>Create your account</h1>
      <p className={styles.sub}>
        Already have one? <Link href="/login">Sign in</Link>
      </p>

      {error && <div className={styles.errorMsg}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input label="Company name" required value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem' }}>
          <Input label="First name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Last name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <Input label="Email address" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input label="Phone (optional)" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input
          label="Password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" loading={loading} style={{ width: '100%' }}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
