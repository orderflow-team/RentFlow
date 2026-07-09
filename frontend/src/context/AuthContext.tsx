'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api-client';
import {
  clearActiveRole,
  clearTokens,
  getAccessToken,
  getActiveRole,
  setActiveRole as persistActiveRole,
  setTokens,
} from '@/lib/auth-storage';
import type { AuthResponse, Profile } from '@/types/api';

interface AuthContextValue {
  profile: Profile | null;
  roles: string[];
  activeRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  requestOtp: (phone: string) => Promise<{ message: string }>;
  verifyOtp: (phone: string, code: string) => Promise<AuthResponse>;
  register: (dto: {
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<AuthResponse>;
  logout: () => void;
  setActiveRole: (role: string) => void;
  clearRoleSelection: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRoleState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(() => !!getAccessToken());
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    const p = await apiGet<Profile>('/auth/profile');
    setProfile(p);
    const roleTypes = p.roles.map((r) => r.type);
    setRoles(roleTypes);
    const stored = getActiveRole();
    setActiveRoleState(stored && roleTypes.includes(stored) ? stored : null);
    return p;
  }, []);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      return;
    }
    // Session hydration on mount: state updates below run after the async
    // profile fetch settles, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile()
      .catch(() => {
        clearTokens();
        setProfile(null);
      })
      .finally(() => setIsLoading(false));
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiPost<AuthResponse>('/auth/login', { email, password });
    setTokens(res.accessToken, res.refreshToken);
    await loadProfile();
    return res;
  }, [loadProfile]);

  const requestOtp = useCallback((phone: string) => apiPost<{ message: string }>('/auth/otp/request', { phone }), []);

  const verifyOtp = useCallback(async (phone: string, code: string) => {
    const res = await apiPost<AuthResponse>('/auth/otp/verify', { phone, code });
    setTokens(res.accessToken, res.refreshToken);
    await loadProfile();
    return res;
  }, [loadProfile]);

  const register = useCallback(
    async (dto: { companyName: string; firstName: string; lastName: string; email: string; password: string; phone?: string }) => {
      const res = await apiPost<AuthResponse>('/auth/register', dto);
      setTokens(res.accessToken, res.refreshToken);
      await loadProfile();
      return res;
    },
    [loadProfile],
  );

  const logout = useCallback(() => {
    clearTokens();
    setProfile(null);
    setRoles([]);
    setActiveRoleState(null);
    router.push('/login');
  }, [router]);

  const setActiveRole = useCallback((role: string) => {
    persistActiveRole(role);
    setActiveRoleState(role);
  }, []);

  const clearRoleSelection = useCallback(() => {
    clearActiveRole();
    setActiveRoleState(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        roles,
        activeRole,
        isLoading,
        isAuthenticated: !!profile,
        login,
        requestOtp,
        verifyOtp,
        register,
        logout,
        setActiveRole,
        clearRoleSelection,
        refreshProfile: async () => {
          await loadProfile();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
