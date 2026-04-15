import { AppLayout } from '@/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface PageTemplateProps {
  title: string;
  subtitle: string;
}

export function PageTemplate({ title, subtitle }: PageTemplateProps) {
  return (
    <AppLayout>
      <div className="space-y-6">
        <SectionHeader title={title} subtitle={subtitle} />
        <Card title="Overview" subtitle="This page is connected to the app router.">
          <p className="text-sm text-slate-600">Use this space to build out page-specific content.</p>
        </Card>
      </div>
    </AppLayout>
  );
}
