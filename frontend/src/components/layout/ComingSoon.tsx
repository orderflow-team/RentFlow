import { PageHeader } from './PageHeader';
import { Card } from '@/components/ui/Card';

export function ComingSoon({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <Card>This view is coming soon in Phase 2.</Card>
    </div>
  );
}
