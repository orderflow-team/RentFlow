'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api-client';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SectionHeading } from '@/components/layout/PageHeader';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/errors';
import type { MaintenanceRequest } from '@/types/api';
import filterStyles from '@/components/ui/FilterBar.module.css';
import modalStyles from '@/components/ui/Modal.module.css';

function priorityColor(p: string) {
  if (p === 'URGENT' || p === 'HIGH') return 'red' as const;
  if (p === 'MEDIUM') return 'yellow' as const;
  return 'gray' as const;
}

function SubmitRequestModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [category, setCategory] = useState('MAINTENANCE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => apiPost('/tenants/me/maintenance', { category, title, description, priority }),
    onSuccess: () => {
      toast('Request submitted', 'success');
      queryClient.invalidateQueries({ queryKey: ['tenant-me-maintenance'] });
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to submit request'),
  });

  return (
    <Modal title="Submit support / maintenance request" onClose={onClose}>
      {error && <div className={modalStyles.formError}>{error}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          mutation.mutate();
        }}
      >
        <Select label="Category *" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="MAINTENANCE">Maintenance & Repairs</option>
          <option value="QUERY">Queries & Support</option>
        </Select>
        <Input label="Title *" placeholder="e.g. Leaking faucet / NOC query" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </Select>
        <div className={modalStyles.actions}>
          <Button type="submit" size="sm" loading={mutation.isPending}>
            Submit
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function MaintenanceSection() {
  const [type, setType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-me-maintenance'],
    queryFn: () => apiGet<MaintenanceRequest[]>('/tenants/me/maintenance'),
  });

  const requests = (data || []).filter((r) => !type || r.category === type);

  return (
    <>
      <SectionHeading>Support &amp; Maintenance requests</SectionHeading>
      <div className={filterStyles.bar}>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="MAINTENANCE">Maintenance & Repairs</option>
          <option value="QUERY">Queries & Support</option>
        </select>
      </div>
      {isLoading ? (
        <Loading />
      ) : requests.length ? (
        <Table headers={['Title', 'Type', 'Priority', 'Status', 'Date']}>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>
                <Tag color="gray">{r.category || 'MAINTENANCE'}</Tag>
              </td>
              <td>
                <Tag color={priorityColor(r.priority)}>{r.priority || '—'}</Tag>
              </td>
              <td>
                <Tag color={statusTagColor(r.status)}>{r.status || '—'}</Tag>
              </td>
              <td>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}</td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState message="No requests matching filter." />
      )}
      <Button size="sm" onClick={() => setModalOpen(true)}>
        + Submit request
      </Button>
      {modalOpen && <SubmitRequestModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
