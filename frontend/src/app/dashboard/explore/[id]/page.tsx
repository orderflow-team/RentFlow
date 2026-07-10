'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api-client';
import { PageHeader, SectionHeading } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Gallery } from '@/components/ui/Gallery';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { useToast } from '@/components/ui/Toast';
import { formatINR } from '@/lib/currency';
import { ApiError } from '@/lib/errors';
import type { DiscoveryPropertyDetail } from '@/types/api';
import styles from './page.module.css';

const PREF_LABELS: Record<string, string> = {
  family: 'Families',
  married: 'Married couples',
  liveIn: 'Live-in',
  students: 'Students',
  professionals: 'Professionals',
  petFriendly: 'Pet friendly',
  vegetarian: 'Vegetarian',
  smokingAllowed: 'Smoking allowed',
};

function titleCase(value?: string | null) {
  if (!value) return null;
  return value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ExplorePropertyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const { data: property, isLoading, isError } = useQuery({
    queryKey: ['discovery-property', id],
    queryFn: () => apiGet<DiscoveryPropertyDetail>(`/discovery/properties/${id}`),
    retry: false,
  });

  const waitlistMutation = useMutation({
    mutationFn: () => apiPost(`/discovery/properties/${id}/waitlist`),
    onSuccess: () => toast('You are on the waiting list — the manager will reach out', 'success'),
    onError: (err) => toast(err instanceof ApiError ? err.message : 'Could not join the waiting list', 'error'),
  });

  if (isLoading) return <Loading />;
  if (isError || !property) {
    return (
      <div>
        <button className={styles.backLink} onClick={() => router.push('/dashboard/explore')}>
          ← Back to explore
        </button>
        <EmptyState message="This property is not available for viewing right now." />
      </div>
    );
  }

  const facts = [
    { label: 'Type', value: titleCase(property.type) },
    { label: 'Furnishing', value: titleCase(property.furnishedStatus) },
    { label: 'Occupancy', value: titleCase(property.occupancyType) },
    { label: 'Year built', value: property.yearBuilt ? String(property.yearBuilt) : null },
    {
      label: 'Expected availability',
      value: property.expectedAvailability ? new Date(property.expectedAvailability).toLocaleDateString() : null,
    },
  ].filter((f) => f.value);

  const suitedFor = Object.entries(property.preferences || {}).filter(([, v]) => v === true);
  const managerInitials = property.manager
    ? property.manager.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : null;

  return (
    <div>
      <button className={styles.backLink} onClick={() => router.push('/dashboard/explore')}>
        ← Back to explore
      </button>
      <PageHeader
        title={property.name}
        subtitle={`${property.address}, ${property.city}, ${property.state} ${property.zipCode}`}
        action={<Tag color={statusTagColor(property.status)}>{property.status === 'AVAILABLE_SOON' ? 'AVAILABLE SOON' : property.status}</Tag>}
      />

      {property.images && property.images.length > 0 ? (
        <Gallery images={property.images} alt={property.name} />
      ) : (
        <div className={styles.noPhotos}>Photos coming soon for this property</div>
      )}

      <div className={styles.layout}>
        <div>
          <div className={styles.factsRow}>
            {facts.map((f) => (
              <span key={f.label} className={styles.fact}>
                <span className={styles.factLabel}>{f.label}:</span> {f.value}
              </span>
            ))}
          </div>

          {property.description && (
            <Card className={styles.rentCard}>
              <p className={styles.description}>{property.description}</p>
            </Card>
          )}

          {suitedFor.length > 0 && (
            <>
              <SectionHeading>Suited for</SectionHeading>
              <div className={styles.prefRow}>
                {suitedFor.map(([key]) => (
                  <span key={key} className={styles.pref}>✓ {PREF_LABELS[key] || titleCase(key)}</span>
                ))}
              </div>
            </>
          )}

          <SectionHeading>Available units</SectionHeading>
          {property.availableUnits.length ? (
            <Table headers={['Unit', 'Building', 'Beds', 'Baths', 'Area', 'Rent / month', 'Status']}>
              {property.availableUnits.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.building || '—'}</td>
                  <td>{u.bedrooms}</td>
                  <td>{u.bathrooms}</td>
                  <td>{u.squareFootage ? `${u.squareFootage} sq.ft` : '—'}</td>
                  <td>{u.rentAmount ? formatINR(u.rentAmount) : 'On request'}</td>
                  <td>
                    <Tag color={statusTagColor(u.status)}>{u.status === 'AVAILABLE_SOON' ? 'AVAILABLE SOON' : u.status}</Tag>
                  </td>
                </tr>
              ))}
            </Table>
          ) : (
            <EmptyState message="No units are open right now — join the waiting list or contact the manager to be notified." />
          )}
        </div>

        <Card className={styles.sideCard}>
          <div className={styles.rentValue}>
            {property.rentRange
              ? property.rentRange.min === property.rentRange.max
                ? formatINR(property.rentRange.min)
                : `${formatINR(property.rentRange.min)} – ${formatINR(property.rentRange.max)}`
              : 'Rent on request'}
          </div>
          <div className={styles.rentSub}>
            per month · {property.availableUnitsCount} of {property.totalUnits} unit{property.totalUnits === 1 ? '' : 's'} available
          </div>

          <hr style={{ border: 0, borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

          <div className={styles.managerRow}>
            <span className={styles.managerAvatar}>{managerInitials || '—'}</span>
            <div>
              <div className={styles.managerLabel}>Property manager</div>
              <div className={styles.managerName}>{property.manager?.name || 'RentFlow office'}</div>
            </div>
          </div>

          {property.manager?.phone && (
            <a className={styles.contactBtn} href={`tel:${property.manager.phone}`}>
              📞 Call {property.manager.phone}
            </a>
          )}
          {property.manager?.email && (
            <a className={styles.contactBtn} href={`mailto:${property.manager.email}?subject=Enquiry about ${encodeURIComponent(property.name)}`}>
              ✉️ Email the manager
            </a>
          )}
          {!property.manager?.phone && !property.manager?.email && (
            <p className={styles.availabilityNote}>Contact details will be shared once a manager is assigned.</p>
          )}

          {property.status === 'AVAILABLE_SOON' && (
            <>
              <Button
                style={{ width: '100%', marginTop: '0.5rem' }}
                loading={waitlistMutation.isPending}
                onClick={() => waitlistMutation.mutate()}
              >
                Join waiting list
              </Button>
              <p className={styles.availabilityNote}>
                This property opens up soon. Join the list and the manager will contact you as soon as a unit is ready.
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
