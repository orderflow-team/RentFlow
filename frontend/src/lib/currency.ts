export function formatINR(amount: number | null | undefined): string {
  return '₹' + (amount || 0).toLocaleString('en-IN');
}
