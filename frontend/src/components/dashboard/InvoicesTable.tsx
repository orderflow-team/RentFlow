'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api-client';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { formatINR } from '@/lib/currency';
import { SectionHeading } from '@/components/layout/PageHeader';
import type { Invoice } from '@/types/api';
import filterStyles from '@/components/ui/FilterBar.module.css';

export function InvoicesTable() {
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['tenant-me-invoices'],
    queryFn: () => apiGet<Invoice[]>('/tenants/me/invoices'),
  });

  const invoices = (data || []).filter((i) => (!category || i.category === category) && (!status || i.status === status));

  return (
    <>
      <SectionHeading>Receipts / Bills</SectionHeading>
      <div className={filterStyles.bar}>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="RENT">Rent</option>
          <option value="UTILITIES">Utility Bills</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="CORPORATION_TAX">Corporation Tax</option>
          <option value="OTHER">Other Charges</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
          <option value="OVERDUE">Overdue</option>
        </select>
      </div>
      {isLoading ? (
        <Loading />
      ) : invoices.length ? (
        <Table headers={['Receipt', 'Category', 'Total', 'Paid', 'Status', 'Due']}>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.invoiceNumber}</td>
              <td>
                <Tag color="gray">{inv.category || 'RENT'}</Tag>
              </td>
              <td>{formatINR(inv.totalAmount)}</td>
              <td>{formatINR(inv.paidAmount)}</td>
              <td>
                <Tag color={statusTagColor(inv.status)}>{inv.status || '—'}</Tag>
              </td>
              <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </Table>
      ) : (
        <EmptyState message="No receipts matching filters." />
      )}
    </>
  );
}
