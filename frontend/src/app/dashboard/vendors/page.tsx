'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api-client';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/errors';
import type { Vendor } from '@/types/api';
import filterStyles from '@/components/ui/FilterBar.module.css';
import modalStyles from '@/components/ui/Modal.module.css';

function AddVendorModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('GENERAL');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      apiPost('/vendors', {
        name,
        contactPerson: contactPerson || undefined,
        email: email || undefined,
        phone: phone || undefined,
        specialty,
        address: address || undefined,
        notes: notes || undefined,
      }),
    onSuccess: () => {
      toast('Vendor added', 'success');
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to add vendor'),
  });

  return (
    <Modal title="Add vendor" onClose={onClose}>
      {error && <div className={modalStyles.formError}>{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>
        <Input label="Vendor name *" placeholder="e.g. Sharma Plumbing Works" required value={name} onChange={(e) => setName(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          <Input label="Contact person" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
          <Select label="Specialty" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
            <option value="PLUMBING">Plumbing</option>
            <option value="ELECTRICAL">Electrical</option>
            <option value="HVAC">HVAC</option>
            <option value="GENERAL">General</option>
            <option value="PAINTING">Painting</option>
            <option value="ROOFING">Roofing</option>
            <option value="LANDSCAPING">Landscaping</option>
            <option value="CLEANING">Cleaning</option>
            <option value="PEST_CONTROL">Pest control</option>
            <option value="SECURITY">Security</option>
            <option value="OTHER">Other</option>
          </Select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          <Input label="Phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Input label="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input label="Notes" placeholder="Optional" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className={modalStyles.actions}>
          <Button type="submit" size="sm" loading={mutation.isPending}>Add vendor</Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function VendorsPage() {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => apiGet<Vendor[]>('/vendors'),
  });

  const q = search.trim().toLowerCase();
  const vendors = (data || []).filter((v) => {
    const matchesSearch = !q || v.name.toLowerCase().includes(q) || (v.contactPerson || '').toLowerCase().includes(q);
    return matchesSearch && (!specialty || v.specialty === specialty);
  });

  return (
    <div>
      <PageHeader
        title="Vendors"
        subtitle="Maintenance vendor directory"
        action={<Button size="sm" onClick={() => setModalOpen(true)}>+ Add vendor</Button>}
      />

      <div className={filterStyles.bar}>
        <input placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
          <option value="">All specialties</option>
          <option value="PLUMBING">Plumbing</option>
          <option value="ELECTRICAL">Electrical</option>
          <option value="HVAC">HVAC</option>
          <option value="GENERAL">General</option>
          <option value="PAINTING">Painting</option>
          <option value="ROOFING">Roofing</option>
          <option value="LANDSCAPING">Landscaping</option>
          <option value="CLEANING">Cleaning</option>
          <option value="PEST_CONTROL">Pest control</option>
          <option value="SECURITY">Security</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <EmptyState message="Could not load vendors right now." />
      ) : vendors.length ? (
        <Table headers={['Name', 'Specialty', 'Contact', 'Phone', 'Email', 'Approved']}>
          {vendors.map((v) => (
            <tr key={v.id}>
              <td>{v.name}</td>
              <td>
                <Tag color="gray">{v.specialty || 'GENERAL'}</Tag>
              </td>
              <td>{v.contactPerson || '—'}</td>
              <td>{v.phone ? <a href={`tel:${v.phone}`}>{v.phone}</a> : '—'}</td>
              <td>{v.email ? <a href={`mailto:${v.email}`}>{v.email}</a> : '—'}</td>
              <td>
                <Tag color={v.isApproved ? 'green' : 'yellow'}>{v.isApproved ? 'Approved' : 'Pending'}</Tag>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState message={q || specialty ? 'No vendors match your filters.' : 'No vendors yet — add your first maintenance vendor.'} />
      )}

      {modalOpen && <AddVendorModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}
