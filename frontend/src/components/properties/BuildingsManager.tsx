'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, fileUrl } from '@/lib/api-client';
import { uploadImages } from '@/lib/upload';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PhotoPicker } from '@/components/ui/PhotoPicker';
import { Lightbox } from '@/components/ui/Gallery';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { SectionHeading } from '@/components/layout/PageHeader';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/errors';
import { formatINR } from '@/lib/currency';
import type { Building, Unit, PropertyImage } from '@/types/api';
import modalStyles from '@/components/ui/Modal.module.css';
import styles from './BuildingsManager.module.css';

function AddBuildingModal({ propertyId, onClose }: { propertyId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [name, setName] = useState('');
  const [totalFloors, setTotalFloors] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      apiPost(`/properties/${propertyId}/buildings`, {
        name,
        totalFloors: totalFloors ? Number(totalFloors) : undefined,
        yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
        description: description || undefined,
      }),
    onSuccess: () => {
      toast('Building added', 'success');
      queryClient.invalidateQueries({ queryKey: ['buildings', propertyId] });
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to add building'),
  });

  return (
    <Modal title="Add Building / Tower" onClose={onClose}>
      {error && <div className={modalStyles.formError}>{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>
        <Input label="Name *" placeholder="e.g. Tower A" required value={name} onChange={(e) => setName(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          <Input label="Total floors" type="number" min={1} value={totalFloors} onChange={(e) => setTotalFloors(e.target.value)} />
          <Input label="Year built" type="number" placeholder="e.g. 2020" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} />
        </div>
        <Input label="Description" placeholder="Optional" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className={modalStyles.actions}>
          <Button type="submit" size="sm" loading={mutation.isPending}>Add building</Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

function AddUnitModal({ buildingId, buildingName, onClose }: { buildingId: string; buildingName: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [name, setName] = useState('');
  const [floorNumber, setFloorNumber] = useState('');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [squareFootage, setSquareFootage] = useState('');
  const [listingType, setListingType] = useState('RENT');
  const [rentAmount, setRentAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [status, setStatus] = useState('VACANT');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState('');

  const showRentField = listingType === 'RENT' || listingType === 'BOTH';
  const showSaleField = listingType === 'SALE' || listingType === 'BOTH';

  const mutation = useMutation({
    mutationFn: async () => {
      const images = await uploadImages(photos);
      return apiPost(`/properties/buildings/${buildingId}/units`, {
        name,
        floorNumber: floorNumber ? Number(floorNumber) : undefined,
        bedrooms: bedrooms ? Number(bedrooms) : undefined,
        bathrooms: bathrooms ? Number(bathrooms) : undefined,
        squareFootage: squareFootage ? Number(squareFootage) : undefined,
        listingType,
        rentAmount: showRentField && rentAmount ? Number(rentAmount) : undefined,
        depositAmount: showRentField && depositAmount ? Number(depositAmount) : undefined,
        salePrice: showSaleField && salePrice ? Number(salePrice) : undefined,
        status,
        description: description || undefined,
        images,
      });
    },
    onSuccess: () => {
      toast('Flat added', 'success');
      queryClient.invalidateQueries({ queryKey: ['units', buildingId] });
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to add flat'),
  });

  return (
    <Modal title={`Add Flat — ${buildingName}`} onClose={onClose}>
      {error && <div className={modalStyles.formError}>{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>
        <PhotoPicker
          label="Flat photos"
          hint="Show tenants the actual flat — rooms, kitchen, balcony view..."
          photos={photos}
          onChange={setPhotos}
          onError={setError}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          <Input label="Flat name / number *" placeholder="e.g. Flat 301" required value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Floor" type="number" min={0} value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.5rem' }}>
          <Input label="Bedrooms" type="number" min={0} value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
          <Input label="Bathrooms" type="number" min={0} value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
          <Input label="Area (sq.ft)" type="number" min={0} value={squareFootage} onChange={(e) => setSquareFootage(e.target.value)} />
        </div>
        <Select label="Listing type — owner preference" value={listingType} onChange={(e) => setListingType(e.target.value)}>
          <option value="RENT">For rent only</option>
          <option value="SALE">For sale only</option>
          <option value="BOTH">For rent &amp; sale</option>
        </Select>
        {showRentField && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
            <Input label="Monthly rent (₹)" type="number" min={0} value={rentAmount} onChange={(e) => setRentAmount(e.target.value)} />
            <Input label="Deposit (₹)" type="number" min={0} value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
          </div>
        )}
        {showSaleField && (
          <Input label="Sale price (₹)" type="number" min={0} placeholder="e.g. 8500000" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} />
        )}
        <Select label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="VACANT">Vacant — ready to rent</option>
          <option value="AVAILABLE_SOON">Available soon</option>
          <option value="OCCUPIED">Occupied</option>
          <option value="MAINTENANCE">Under maintenance</option>
          <option value="RESERVED">Reserved</option>
          <option value="UNLISTED">Unlisted</option>
        </Select>
        <Input label="Description" placeholder="e.g. Sea-facing 2BHK with modular kitchen" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className={modalStyles.actions}>
          <Button type="submit" size="sm" loading={mutation.isPending}>Add flat</Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

export function ListingBadge({ listingType }: { listingType: string }) {
  if (listingType === 'SALE') return <span className={styles.listingBadge}>For Sale</span>;
  if (listingType === 'BOTH') return <span className={styles.listingBadge}>For Rent &amp; Sale</span>;
  return null;
}

export function UnitCard({ unit, footer }: { unit: Unit; footer?: React.ReactNode }) {
  const [lightbox, setLightbox] = useState(false);
  const images = (unit.images || []) as PropertyImage[];
  const cover = fileUrl(images[0]?.url);

  const specs = [
    `${unit.bedrooms} bed`,
    `${unit.bathrooms} bath`,
    unit.squareFootage ? `${unit.squareFootage} sq.ft` : null,
    unit.floorNumber !== null && unit.floorNumber !== undefined ? `Floor ${unit.floorNumber}` : null,
  ].filter(Boolean);

  return (
    <div className={styles.unitCard}>
      <div className={styles.unitImgWrap} onClick={() => images.length && setLightbox(true)}>
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={unit.name} />
        ) : (
          <div className={styles.noPhoto}>No photos yet</div>
        )}
        {images.length > 0 && <span className={styles.photoBadge}>📷 {images.length}</span>}
      </div>
      <div className={styles.unitBody}>
        <div className={styles.unitTop}>
          <span className={styles.unitName}>{unit.name}</span>
          <Tag color={statusTagColor(unit.status)}>{unit.status === 'AVAILABLE_SOON' ? 'SOON' : unit.status}</Tag>
        </div>
        <div className={styles.unitSpecs}>{specs.join(' · ')}</div>
        <ListingBadge listingType={unit.listingType} />
        {(unit.listingType === 'RENT' || unit.listingType === 'BOTH') && (
          <div className={styles.unitRent}>
            {unit.rentAmount ? formatINR(unit.rentAmount) : 'Rent on request'} <span className={styles.unitRentUnit}>/ month</span>
          </div>
        )}
        {(unit.listingType === 'SALE' || unit.listingType === 'BOTH') && (
          <div className={styles.unitRent}>
            {unit.salePrice ? formatINR(unit.salePrice) : 'Price on request'} <span className={styles.unitRentUnit}>sale price</span>
          </div>
        )}
        {footer}
      </div>
      {lightbox && <Lightbox images={images} alt={unit.name} onClose={() => setLightbox(false)} />}
    </div>
  );
}

function BuildingSection({ building, canManage }: { building: Building; canManage: boolean }) {
  const [addUnitOpen, setAddUnitOpen] = useState(false);

  const { data: units, isLoading } = useQuery({
    queryKey: ['units', building.id],
    queryFn: () => apiGet<Unit[]>(`/properties/buildings/${building.id}/units`),
  });

  const meta = [
    building.totalFloors ? `${building.totalFloors} floor${building.totalFloors === 1 ? '' : 's'}` : null,
    `${units?.length ?? building.unitCount ?? 0} flat${(units?.length ?? building.unitCount ?? 0) === 1 ? '' : 's'}`,
    building.yearBuilt ? `Built ${building.yearBuilt}` : null,
  ].filter(Boolean);

  return (
    <Card className={styles.buildingCard}>
      <div className={styles.buildingHeader}>
        <div className={styles.buildingTitle}>
          <span className={styles.buildingIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 21V5l7-3 7 3v16" />
              <path d="M2 21h20" />
              <path d="M9 8h.01M9 12h.01M9 16h.01M13 8h.01M13 12h.01M13 16h.01" />
            </svg>
          </span>
          <span>
            {building.name}
            <div className={styles.buildingMeta}>{meta.join(' · ')}</div>
          </span>
        </div>
        {canManage && (
          <Button size="sm" variant="secondary" onClick={() => setAddUnitOpen(true)}>
            + Add flat
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className={styles.emptyUnits}>Loading flats...</div>
      ) : units?.length ? (
        <div className={styles.unitsGrid}>
          {units.map((u) => (
            <UnitCard key={u.id} unit={u} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyUnits}>No flats in this building yet{canManage ? ' — add the first one.' : '.'}</div>
      )}

      {addUnitOpen && <AddUnitModal buildingId={building.id} buildingName={building.name} onClose={() => setAddUnitOpen(false)} />}
    </Card>
  );
}

export function BuildingsManager({ propertyId, canManage }: { propertyId: string; canManage: boolean }) {
  const [addBuildingOpen, setAddBuildingOpen] = useState(false);

  const { data: buildings, isLoading } = useQuery({
    queryKey: ['buildings', propertyId],
    queryFn: () => apiGet<Building[]>(`/properties/${propertyId}/buildings`),
  });

  return (
    <div>
      <SectionHeading>
        Buildings &amp; Flats
        {canManage && (
          <span className={styles.sectionActions} style={{ marginLeft: 'auto' }}>
            <Button size="sm" onClick={() => setAddBuildingOpen(true)}>+ Add building</Button>
          </span>
        )}
      </SectionHeading>

      {isLoading ? (
        <div className={styles.emptyUnits}>Loading buildings...</div>
      ) : buildings?.length ? (
        buildings.map((b) => <BuildingSection key={b.id} building={b} canManage={canManage} />)
      ) : (
        <div className={styles.emptyUnits}>
          No buildings yet{canManage ? ' — add a building or tower, then add flats with photos inside it.' : '.'}
        </div>
      )}

      {addBuildingOpen && <AddBuildingModal propertyId={propertyId} onClose={() => setAddBuildingOpen(false)} />}
    </div>
  );
}
