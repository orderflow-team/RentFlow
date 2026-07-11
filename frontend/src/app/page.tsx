import type { Metadata } from 'next';
import { HomeLanding } from '@/components/home/HomeLanding';

export const metadata: Metadata = {
  title: 'RentFlow — Property management, beautifully unified',
  description:
    'Manage buildings, flats, tenants, leases, rent, maintenance and vendors in one modern workspace. Built for managers, tenants and owners.',
};

export default function RootPage() {
  return <HomeLanding />;
}
