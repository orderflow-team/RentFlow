'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPatch } from '@/lib/api-client';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/errors';
import modalStyles from '@/components/ui/Modal.module.css';

export function ChangeManagerModal({ propertyId, onClose }: { propertyId: string; onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [phone, setPhone] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      apiPatch(`/properties/${propertyId}/manager`, {
        phone,
        firstName: firstName || undefined,
        lastName: lastName || undefined,
      }),
    onSuccess: () => {
      toast('Manager updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to update manager'),
  });

  return (
    <Modal title="Switch manager" onClose={onClose}>
      {error && <div className={modalStyles.formError}>{error}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <Input
          label="Manager's phone number *"
          type="tel"
          placeholder="+91 98765 43210"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          <Input label="First name" placeholder="If new manager" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          <Input label="Last name" placeholder="If new manager" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-faint)', marginTop: '-0.5rem', marginBottom: '1rem' }}>
          If this phone number isn&rsquo;t registered yet, a new manager account is created automatically.
        </p>
        <div className={modalStyles.actions}>
          <Button type="submit" size="sm" loading={mutation.isPending}>
            Switch manager
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
