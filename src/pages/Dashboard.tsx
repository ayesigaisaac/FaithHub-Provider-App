import { ArrowUpRight, BookOpen, CalendarCheck, Clock3, Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProviderStandaloneLayout } from '@/components/shell/ProviderStandaloneLayout';

const stats = [
  {
    title: 'Upcoming Sessions',
    value: '12',
    detail: '3 this week',
    icon: <CalendarCheck className="h-5 w-5 text-emerald-600" />,
  },
  {
    title: 'Total Teachings',
    value: '148',
    detail: '+8 this month',
    icon: <BookOpen className="h-5 w-5 text-emerald-600" />,
  },
  {
    title: 'Avg. Session Duration',
    value: '42 min',
    detail: 'Stable from last month',
    icon: <Clock3 className="h-5 w-5 text-emerald-600" />,
  },
  {
    title: 'Active Learners',
    value: '1,284',
    detail: '+9.2% growth',
    icon: <Users className="h-5 w-5 text-emerald-600" />,
  },
];

const upcoming = [
  { title: 'Leadership Essentials', date: 'Tue, 4:00 PM', status: 'Scheduled' },
  { title: 'Prayer & Discipline', date: 'Thu, 6:30 PM', status: 'Draft' },
  { title: 'Faith Foundations', date: 'Sat, 10:00 AM', status: 'Scheduled' },
];

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <ProviderStandaloneLayout pagePath="/faithhub/provider/dashboard" pageTitle="Provider Dashboard">
      <div className="space-y-6 p-4 sm:p-6">
        <SectionHeader
          title="Provider Dashboard"
          subtitle="Track sessions, teaching performance, and community momentum in one place."
          actions={
            <>
              <Button variant="outline" onClick={() => window.print()}>
                Export
              </Button>
              <Button variant="secondary" onClick={() => navigate('/faithhub/provider/live-builder')}>
                <Plus className="mr-2 h-4 w-4" />
                New Session
              </Button>
              <Button onClick={() => navigate('/faithhub/provider/standalone-teaching-builder')}>
                <Plus className="mr-2 h-4 w-4" />
                Teaching
              </Button>
            </>
          }
        />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.title} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{item.title}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{item.value}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
                </div>
                <span className="rounded-lg bg-emerald-50 p-2">{item.icon}</span>
              </div>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <Card
            title="Upcoming Sessions"
            subtitle="Your next sessions for the week"
            className="xl:col-span-2"
          >
            <div className="space-y-3">
              {upcoming.map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.date}</p>
                  </div>
                  <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Performance" subtitle="Last 30 days">
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm text-slate-500">Completion Rate</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">91%</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-sm text-slate-500">Session Rating</p>
                <p className="mt-1 text-xl font-semibold text-slate-900">4.8/5</p>
              </div>
              <button
                type="button"
                className="inline-flex items-center text-sm font-medium text-emerald-700 hover:text-emerald-800"
                onClick={() => navigate('/faithhub/provider/teachings-dashboard')}
              >
                View full analytics
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          </Card>
        </section>
      </div>
    </ProviderStandaloneLayout>
  );
}
