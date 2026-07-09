'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { roleLabel, isStaffRole, isOwnerRole, isTenantRole, RoleType } from '@/lib/roles';
import styles from './Sidebar.module.css';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  show: boolean;
}

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const icons = {
  dashboard: (
    <Icon>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </Icon>
  ),
  explore: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </Icon>
  ),
  properties: (
    <Icon>
      <path d="M4 21V7l6-4 6 4v14" />
      <path d="M16 9h4v12" />
      <path d="M4 21h18" />
      <path d="M8 9h.01M8 13h.01M12 9h.01M12 13h.01" />
    </Icon>
  ),
  tenants: (
    <Icon>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" />
      <path d="M17.5 14.5c2.1.8 3.5 2.9 3.5 5.5" />
    </Icon>
  ),
  leases: (
    <Icon>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </Icon>
  ),
  finance: (
    <Icon>
      <path d="M3 17l5-5 4 4 8-8" />
      <path d="M15 8h5v5" />
    </Icon>
  ),
  maintenance: (
    <Icon>
      <path d="M14.7 6.3a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 0 0 5.6-6L14.5 12l-2.5-2.5z" />
    </Icon>
  ),
  vendors: (
    <Icon>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18" />
    </Icon>
  ),
};

export function Sidebar() {
  const { profile, roles, activeRole, logout } = useAuth();
  const pathname = usePathname();

  const role = activeRole || roles[0];
  const staff = isStaffRole(role);
  const owner = isOwnerRole(role);
  const tenant = isTenantRole(role);
  const adminOrManager = role === RoleType.ADMIN || role === RoleType.MANAGER;

  const navItems: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: icons.dashboard, show: true },
    { href: '/dashboard/explore', label: 'Explore Properties', icon: icons.explore, show: tenant },
    { href: '/dashboard/properties', label: 'Properties', icon: icons.properties, show: staff || owner },
    { href: '/dashboard/tenants', label: 'Tenants', icon: icons.tenants, show: staff || owner },
    { href: '/dashboard/leases', label: 'Leases', icon: icons.leases, show: staff },
    { href: '/dashboard/finance', label: 'Finance', icon: icons.finance, show: staff || owner },
    { href: '/dashboard/maintenance', label: 'Maintenance', icon: icons.maintenance, show: staff || owner },
    { href: '/dashboard/vendors', label: 'Vendors', icon: icons.vendors, show: adminOrManager },
  ];

  const initials = (profile?.firstName?.[0] || profile?.email?.[0] || '?').toUpperCase();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.mark}>RF</span> RentFlow
      </div>
      <div className={styles.navItems}>
        <div className={styles.sectionLabel}>Workspace</div>
        {navItems
          .filter((i) => i.show)
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
      </div>
      <div className={styles.userSection}>
        <div className={styles.userRow}>
          <span className={styles.avatar}>{initials}</span>
          <div className={styles.userMeta}>
            <div className={styles.email}>{profile?.email}</div>
            <div className={styles.role}>{roleLabel(role || '')}</div>
          </div>
        </div>
        {roles.length > 1 && (
          <Link href="/dashboard/select-role" className={styles.switchLink}>
            Switch portal
          </Link>
        )}
        <button className={styles.logoutBtn} onClick={logout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
