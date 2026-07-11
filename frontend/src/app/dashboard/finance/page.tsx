'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api-client';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { Table, EmptyState, Loading } from '@/components/ui/Table';
import { Tag, statusTagColor } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { ApiError } from '@/lib/errors';
import { formatINR } from '@/lib/currency';
import type { Paginated, Invoice, Expense } from '@/types/api';
import filterStyles from '@/components/ui/FilterBar.module.css';
import modalStyles from '@/components/ui/Modal.module.css';

function RecordPaymentModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const due = invoice.balanceDue ?? Math.max(invoice.totalAmount - invoice.paidAmount, 0);
  const [amount, setAmount] = useState(String(due));
  const [method, setMethod] = useState('ONLINE');
  const [reference, setReference] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      apiPost(`/invoices/${invoice.id}/payments`, {
        amount: Number(amount),
        paymentMethod: method,
        reference: reference || undefined,
      }),
    onSuccess: () => {
      toast('Payment recorded', 'success');
      queryClient.invalidateQueries({ queryKey: ['finance-invoices'] });
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to record payment'),
  });

  return (
    <Modal title={`Record payment — ${invoice.invoiceNumber}`} onClose={onClose}>
      {error && <div className={modalStyles.formError}>{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>
        <Input label={`Amount (₹) * — ${formatINR(due)} due`} type="number" min={1} required value={amount} onChange={(e) => setAmount(e.target.value)} />
        <Select label="Method" value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="ONLINE">Online / UPI</option>
          <option value="BANK_TRANSFER">Bank transfer</option>
          <option value="CASH">Cash</option>
          <option value="CHECK">Cheque</option>
          <option value="CREDIT_CARD">Credit card</option>
          <option value="DEBIT_CARD">Debit card</option>
          <option value="OTHER">Other</option>
        </Select>
        <Input label="Reference" placeholder="Transaction id / cheque no. (optional)" value={reference} onChange={(e) => setReference(e.target.value)} />
        <div className={modalStyles.actions}>
          <Button type="submit" size="sm" loading={mutation.isPending}>Record</Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

function AddExpenseModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [category, setCategory] = useState('MAINTENANCE');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [vendor, setVendor] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: () =>
      apiPost('/expenses', {
        category,
        amount: Number(amount),
        description: description || undefined,
        vendor: vendor || undefined,
        expenseDate: expenseDate ? new Date(expenseDate).toISOString() : undefined,
      }),
    onSuccess: () => {
      toast('Expense added', 'success');
      queryClient.invalidateQueries({ queryKey: ['finance-expenses'] });
      onClose();
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Failed to add expense'),
  });

  return (
    <Modal title="Add expense" onClose={onClose}>
      {error && <div className={modalStyles.formError}>{error}</div>}
      <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          <Select label="Category *" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="REPAIRS">Repairs</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="UTILITIES">Utilities</option>
            <option value="INSURANCE">Insurance</option>
            <option value="TAXES">Taxes</option>
            <option value="MANAGEMENT">Management</option>
            <option value="MARKETING">Marketing</option>
            <option value="CLEANING">Cleaning</option>
            <option value="LANDSCAPING">Landscaping</option>
            <option value="SECURITY">Security</option>
          </Select>
          <Input label="Amount (₹) *" type="number" min={1} required value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <Input label="Description" placeholder="What was this for?" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.5rem' }}>
          <Input label="Vendor" placeholder="Optional" value={vendor} onChange={(e) => setVendor(e.target.value)} />
          <Input label="Date" type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
        </div>
        <div className={modalStyles.actions}>
          <Button type="submit" size="sm" loading={mutation.isPending}>Add expense</Button>
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function FinancePage() {
  const [tab, setTab] = useState<'invoices' | 'expenses'>('invoices');
  const [invoiceStatus, setInvoiceStatus] = useState('');
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const invoicesQuery = useQuery({
    queryKey: ['finance-invoices'],
    queryFn: () => apiGet<Paginated<Invoice>>('/invoices?limit=100'),
  });
  const expensesQuery = useQuery({
    queryKey: ['finance-expenses'],
    queryFn: () => apiGet<Paginated<Expense>>('/expenses?limit=100'),
  });

  const invoices = (invoicesQuery.data?.data || []).filter((i) => !invoiceStatus || i.status === invoiceStatus);
  const expenses = expensesQuery.data?.data || [];

  const allInvoices = invoicesQuery.data?.data || [];
  const totals = {
    billed: allInvoices.reduce((s, i) => s + (i.totalAmount || 0), 0),
    collected: allInvoices.reduce((s, i) => s + (i.paidAmount || 0), 0),
    outstanding: allInvoices.reduce((s, i) => s + Math.max((i.totalAmount || 0) - (i.paidAmount || 0), 0), 0),
    expenses: expenses.reduce((s, e) => s + (e.amount || 0), 0),
  };

  return (
    <div>
      <PageHeader
        title="Finance"
        subtitle="Receipts, payments, and expenses"
        action={tab === 'expenses' ? <Button size="sm" onClick={() => setExpenseModalOpen(true)}>+ Add expense</Button> : undefined}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard label="Total billed" value={invoicesQuery.isLoading ? '—' : formatINR(totals.billed)} sub="All receipts" />
        <StatCard label="Collected" value={invoicesQuery.isLoading ? '—' : formatINR(totals.collected)} sub="Payments received" />
        <StatCard label="Outstanding" value={invoicesQuery.isLoading ? '—' : formatINR(totals.outstanding)} sub="Awaiting payment" />
        <StatCard label="Expenses" value={expensesQuery.isLoading ? '—' : formatINR(totals.expenses)} sub="Total spent" />
      </div>

      <div className={filterStyles.bar}>
        <select value={tab} onChange={(e) => setTab(e.target.value as 'invoices' | 'expenses')}>
          <option value="invoices">Receipts</option>
          <option value="expenses">Expenses</option>
        </select>
        {tab === 'invoices' && (
          <select value={invoiceStatus} onChange={(e) => setInvoiceStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partially paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="DRAFT">Draft</option>
          </select>
        )}
      </div>

      {tab === 'invoices' &&
        (invoicesQuery.isLoading ? (
          <Loading />
        ) : invoicesQuery.isError ? (
          <EmptyState message="Could not load receipts right now." />
        ) : invoices.length ? (
          <Table headers={['Receipt', 'Tenant', 'Flat', 'Total', 'Paid', 'Due date', 'Status', '']}>
            {invoices.map((inv) => {
              const due = Math.max((inv.totalAmount || 0) - (inv.paidAmount || 0), 0);
              return (
                <tr key={inv.id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.tenant || '—'}</td>
                  <td>{inv.unit || '—'}</td>
                  <td>{formatINR(inv.totalAmount)}</td>
                  <td>{formatINR(inv.paidAmount)}</td>
                  <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                  <td>
                    <Tag color={statusTagColor(inv.status)}>{inv.status || '—'}</Tag>
                  </td>
                  <td>
                    {due > 0 && (
                      <Button size="sm" variant="secondary" onClick={() => setPayingInvoice(inv)}>
                        Record payment
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </Table>
        ) : (
          <EmptyState message={invoiceStatus ? 'No receipts with this status.' : 'No receipts yet.'} />
        ))}

      {tab === 'expenses' &&
        (expensesQuery.isLoading ? (
          <Loading />
        ) : expensesQuery.isError ? (
          <EmptyState message="Could not load expenses right now." />
        ) : expenses.length ? (
          <Table headers={['Category', 'Amount', 'Description', 'Vendor', 'Date']}>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>
                  <Tag color="gray">{e.category}</Tag>
                </td>
                <td>{formatINR(e.amount)}</td>
                <td>{e.description || '—'}</td>
                <td>{e.vendor || '—'}</td>
                <td>{e.expenseDate ? new Date(e.expenseDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </Table>
        ) : (
          <EmptyState message='No expenses recorded yet — click "Add expense" to log the first one.' />
        ))}

      {payingInvoice && <RecordPaymentModal invoice={payingInvoice} onClose={() => setPayingInvoice(null)} />}
      {expenseModalOpen && <AddExpenseModal onClose={() => setExpenseModalOpen(false)} />}
    </div>
  );
}
