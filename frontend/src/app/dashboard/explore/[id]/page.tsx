'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiGet, apiPost, fileUrl } from '@/lib/api-client';
import { PageHeader, SectionHeading } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Gallery, Lightbox } from '@/components/ui/Gallery';
import { EmptyState, Loading } from '@/components/ui/Table';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { useToast } from '@/components/ui/Toast';
import { formatINR } from '@/lib/currency';
import { ApiError } from '@/lib/errors';
import { ListingBadge } from '@/components/properties/BuildingsManager';
import type { DiscoveryPropertyDetail, DiscoveryUnit } from '@/types/api';
import styles from './page.module.css';

function UnitExploreCard({ unit }: { unit: DiscoveryUnit }) {
  const [lightbox, setLightbox] = useState(false);
  const images = unit.images || [];
  const cover = fileUrl(images[0]?.url);

  return (
    <div className={styles.unitCard}>
      <div className={styles.unitImgWrap} onClick={() => images.length && setLightbox(true)}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={unit.name} />
        ) : (
          <div className={styles.unitNoPhoto}>Photos coming soon</div>
        )}
        {images.length > 0 && <span className={styles.unitPhotoBadge}>📷 {images.length}</span>}
      </div>
      <div className={styles.unitBody}>
        <div className={styles.unitTop}>
          <span className={styles.unitName}>{unit.name}</span>
          <Tag color={statusTagColor(unit.status)}>{unit.status === 'AVAILABLE_SOON' ? 'SOON' : unit.status}</Tag>
        </div>
        {unit.building && <div className={styles.unitBuilding}>{unit.building}</div>}
        <div className={styles.unitSpecs}>
          {unit.bedrooms} bed · {unit.bathrooms} bath{unit.squareFootage ? ` · ${unit.squareFootage} sq.ft` : ''}
        </div>
        <ListingBadge listingType={unit.listingType} />
        {(unit.listingType === 'RENT' || unit.listingType === 'BOTH') && (
          <div className={styles.unitRent}>
            {unit.rentAmount ? formatINR(unit.rentAmount) : 'On request'} <span className={styles.unitRentUnit}>/ month</span>
          </div>
        )}
        {(unit.listingType === 'SALE' || unit.listingType === 'BOTH') && (
          <div className={styles.unitRent}>
            {unit.salePrice ? formatINR(unit.salePrice) : 'On request'} <span className={styles.unitRentUnit}>sale price</span>
          </div>
        )}
      </div>
      {lightbox && <Lightbox images={images} alt={unit.name} onClose={() => setLightbox(false)} />}
    </div>
  );
}

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

          <SectionHeading>Available flats</SectionHeading>
          {property.availableUnits.length ? (
            <div className={styles.unitsGrid}>
              {property.availableUnits.map((u) => (
                <UnitExploreCard key={u.id} unit={u} />
              ))}
            </div>
          ) : (
            <EmptyState message="No flats are open right now — join the waiting list or contact the manager to be notified." />
          )}
        </div>

        <Card className={styles.sideCard}>
          {property.rentRange && (
            <>
              <div className={styles.rentValue}>
                {property.rentRange.min === property.rentRange.max
                  ? formatINR(property.rentRange.min)
                  : `${formatINR(property.rentRange.min)} – ${formatINR(property.rentRange.max)}`}
              </div>
              <div className={styles.rentSub}>
                per month · {property.availableUnitsCount} of {property.totalUnits} flat{property.totalUnits === 1 ? '' : 's'} available
              </div>
            </>
          )}
          {property.saleRange && (
            <>
              <div className={styles.rentValue}>
                {property.saleRange.min === property.saleRange.max
                  ? formatINR(property.saleRange.min)
                  : `${formatINR(property.saleRange.min)} – ${formatINR(property.saleRange.max)}`}
              </div>
              <div className={styles.rentSub}>sale price</div>
            </>
          )}
          {!property.rentRange && !property.saleRange && (
            <>
              <div className={styles.rentValue}>Price on request</div>
              <div className={styles.rentSub}>
                {property.availableUnitsCount} of {property.totalUnits} flat{property.totalUnits === 1 ? '' : 's'} available
              </div>
            </>
          )}

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
