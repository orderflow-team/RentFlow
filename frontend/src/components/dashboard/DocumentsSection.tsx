'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPost, apiUpload } from '@/lib/api-client';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SectionHeading } from '@/components/layout/PageHeader';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/errors';
import type { TenantDocument } from '@/types/api';
import modalStyles from '@/components/ui/Modal.module.css';
import tableStyles from '@/components/ui/Table.module.css';

function AddDocumentModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('OTHER');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () => {
      if (file) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('title', title);
        fd.append('category', category);
        return apiUpload('/tenants/me/documents/upload', fd);
      }
      return apiPost('/tenants/me/documents', { title, category, url: url || undefined });
    },
    onSuccess: () => {
      toast('Document added', 'success');
      queryClient.invalidateQueries({ queryKey: ['tenant-me-documents'] });
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to add document'),
  });

  return (
    <Modal title="Add document" onClose={onClose}>
      {error && <div className={modalStyles.formError}>{error}</div>}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          mutation.mutate();
        }}
      >
        <Input label="Title *" placeholder="e.g. Aadhaar card, Signed agreement" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="ID_PROOF">ID Proof</option>
          <option value="LEASE_AGREEMENT">Lease Agreement</option>
          <option value="INCOME_PROOF">Income Proof</option>
          <option value="OTHER">Other</option>
        </Select>
        <Input
          label="Upload file (image, PDF, Word, Excel...)"
          type="file"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <Input label="...or paste a link instead" type="url" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
        <div className={modalStyles.actions}>
          <Button type="submit" size="sm" loading={mutation.isPending}>
            {file ? 'Upload' : 'Add'}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function DocumentsSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-me-documents'],
    queryFn: () => apiGet<TenantDocument[]>('/tenants/me/documents'),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => apiDelete(`/tenants/me/documents/${id}`),
    onSuccess: () => {
      toast('Document removed', 'success');
      queryClient.invalidateQueries({ queryKey: ['tenant-me-documents'] });
    },
    onError: () => toast('Failed to remove document', 'error'),
  });

  const documents = data || [];

  return (
    <>
      <SectionHeading>My Documents</SectionHeading>
      {isLoading ? (
        <Loading />
      ) : documents.length ? (
        <Table headers={['Title', 'Category', 'Added', '']}>
          {documents.map((d) => (
            <tr key={d.id}>
              <td>
                {d.url ? (
                  <a href={d.url} target="_blank" rel="noopener noreferrer">
                    {d.title}
                  </a>
                ) : (
                  d.title
                )}
              </td>
              <td>
                <Tag color="gray">{d.category || 'OTHER'}</Tag>
              </td>
              <td>{d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString() : '—'}</td>
              <td>
                <a
                  href="#"
                  className={tableStyles.dangerLink}
                  onClick={(e) => {
                    e.preventDefault();
                    removeMutation.mutate(d.id);
                  }}
                >
                  Remove
                </a>
              </td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState message="No documents yet." />
      )}
      <Button size="sm" onClick={() => setModalOpen(true)}>
        + Add document
      </Button>
      {modalOpen && <AddDocumentModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
