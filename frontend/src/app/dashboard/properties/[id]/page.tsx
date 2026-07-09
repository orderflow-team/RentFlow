'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Table';
import type { Property } from '@/types/api';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => apiGet<Property>(`/properties/${id}`),
  });

  if (isLoading) return <Loading />;
  if (!property) return <Card>Property not found.</Card>;

  return (
    <div>
      <button onClick={() => router.push('/dashboard/properties')} style={{ background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', marginBottom: '1rem', fontSize: '.85rem' }}>
        ← Back to properties
      </button>
      <PageHeader title={property.name} subtitle="Buildings inside this property" />
      <Card style={{ marginBottom: '1rem' }}>
        <strong>Manager:</strong>{' '}
        {property.manager ? `${property.manager.firstName} ${property.manager.lastName}${property.manager.phone ? ' · ' + property.manager.phone : ''}` : 'No manager assigned yet'}
      </Card>
      <Card>Buildings management is coming soon.</Card>
    </div>
  );
}
