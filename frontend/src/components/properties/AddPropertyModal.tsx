'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/errors';

export function AddPropertyModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [type, setType] = useState('APARTMENT_COMPLEX');
  const [yearBuilt, setYearBuilt] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      apiPost('/properties', {
        name,
        address,
        city,
        state,
        zipCode,
        type,
        yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
        description: description || undefined,
      }),
    onSuccess: () => {
      toast('Property created', 'success');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to create property'),
  });

  return (
    <Modal title="Add Property" onClose={onClose}>
      {error && <div style={{ color: '#dc2626', fontSize: '.82rem', marginBottom: '.75rem' }}>{error}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <Input label="Name *" placeholder="Property name" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Address *" placeholder="Street address" required value={address} onChange={(e) => setAddress(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '.5rem' }}>
          <Input label="City *" required value={city} onChange={(e) => setCity(e.target.value)} />
          <Input label="State *" required value={state} onChange={(e) => setState(e.target.value)} />
          <Input label="ZIP" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="APARTMENT_COMPLEX">Apartment Complex</option>
            <option value="SINGLE_FAMILY">Single Family</option>
            <option value="MULTI_FAMILY">Multi Family</option>
            <option value="COMMERCIAL">Commercial</option>
            <option value="MIXED_USE">Mixed Use</option>
          </Select>
          <Input label="Year Built" type="number" placeholder="e.g. 2020" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} />
        </div>
        <Input label="Description" placeholder="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem' }}>
          <Button type="submit" size="sm" loading={mutation.isPending}>
            Create
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
