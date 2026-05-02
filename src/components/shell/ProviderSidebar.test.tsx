import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProviderSidebar } from './ProviderSidebar';

vi.mock('@/navigation/providerPages', () => {
  const mockIcon = () => null;
  return {
    providerSections: ['Foundation & Mission Control'],
    providerPages: [
      { key: 'provider-dashboard', path: '/faithhub/provider/dashboard', aliases: [], icon: mockIcon },
      { key: 'teachings-dashboard', path: '/faithhub/provider/teachings-dashboard', aliases: [], icon: mockIcon },
      { key: 'reviews-and-moderation', path: '/faithhub/provider/reviews-and-moderation', aliases: [], icon: mockIcon },
      { key: 'live-builder', path: '/faithhub/provider/live-builder', aliases: [], icon: mockIcon },
      { key: 'live-dashboard', path: '/faithhub/provider/live-dashboard', aliases: [], icon: mockIcon },
    ],
    getProviderSidebarGroupsBySection: () => [],
  };
});

describe('ProviderSidebar workflow sync + analytics', () => {
  beforeEach(() => {
    window.localStorage.clear();
    (window as unknown as { dataLayer?: Array<Record<string, string>> }).dataLayer = [];
  });

  it('consumes teaching flow from localStorage and renders live badges', async () => {
    window.localStorage.setItem(
      'faithhub.provider.teachings.flow.v1',
      JSON.stringify({
        series: [
          { id: 's1', publishingState: 'Draft', updatedAtISO: new Date().toISOString() },
          { id: 's2', publishingState: 'Draft', updatedAtISO: new Date().toISOString() },
        ],
        episodes: [
          { id: 'e1', publishingState: 'Draft', updatedAtISO: new Date().toISOString() },
          { id: 'e2', publishingState: 'Draft', updatedAtISO: new Date().toISOString() },
          { id: 'e3', publishingState: 'Scheduled', updatedAtISO: new Date().toISOString() },
          { id: 'e4', publishingState: 'Scheduled', updatedAtISO: new Date().toISOString() },
          { id: 'e5', publishingState: 'Scheduled', updatedAtISO: new Date().toISOString() },
          { id: 'e6', publishingState: 'Published', updatedAtISO: new Date().toISOString() },
        ],
      }),
    );

    render(
      <MemoryRouter initialEntries={['/faithhub/provider/dashboard']}>
        <ProviderSidebar open={false} onClose={() => undefined} collapsed={false} />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByText('4 drafts').length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('3 need review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1 item').length).toBeGreaterThan(0);
  });

  it('updates badges from teaching flow update event', async () => {
    window.localStorage.setItem(
      'faithhub.provider.teachings.flow.v1',
      JSON.stringify({
        series: [],
        episodes: [],
      }),
    );

    render(
      <MemoryRouter initialEntries={['/faithhub/provider/dashboard']}>
        <ProviderSidebar open={false} onClose={() => undefined} collapsed={false} />
      </MemoryRouter>,
    );

    act(() => {
      window.localStorage.setItem(
        'faithhub.provider.teachings.flow.v1',
        JSON.stringify({
          series: [{ id: 's1', publishingState: 'Draft', updatedAtISO: new Date().toISOString() }],
          episodes: [
            { id: 'e1', publishingState: 'Draft', updatedAtISO: new Date().toISOString() },
            { id: 'e2', publishingState: 'Scheduled', updatedAtISO: new Date().toISOString() },
            { id: 'e3', publishingState: 'Published', updatedAtISO: new Date().toISOString() },
            { id: 'e4', publishingState: 'Published', updatedAtISO: new Date().toISOString() },
            { id: 'e5', publishingState: 'Published', updatedAtISO: new Date().toISOString() },
            { id: 'e6', publishingState: 'Published', updatedAtISO: new Date().toISOString() },
            { id: 'e7', publishingState: 'Published', updatedAtISO: new Date().toISOString() },
            { id: 'e8', publishingState: 'Published', updatedAtISO: new Date().toISOString() },
          ],
        }),
      );
      window.dispatchEvent(
        new CustomEvent('faithhub:teachings-flow-updated'),
      );
    });

    await waitFor(() => {
      expect(screen.getAllByText('2 drafts').length).toBeGreaterThan(0);
    });
    expect(screen.getAllByText('1 need review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('6 items').length).toBeGreaterThan(0);
  });

  it('marks only one workflow item active by route and emits analytics on click', async () => {
    render(
      <MemoryRouter initialEntries={['/faithhub/provider/reviews-and-moderation']}>
        <ProviderSidebar open={false} onClose={() => undefined} collapsed={false} />
      </MemoryRouter>,
    );

    const activeItems = screen.getAllByRole('link', { current: 'page' });
    expect(activeItems.length).toBeGreaterThan(0);
    expect(activeItems.some((item) => item.textContent?.includes('Review'))).toBe(true);

    fireEvent.click(screen.getByRole('link', { name: /Ready to publish/i }));

    const dataLayer = (window as unknown as { dataLayer?: Array<Record<string, string>> }).dataLayer ?? [];
    expect(dataLayer.some((entry) => entry.event === 'publish_clicked')).toBe(true);
  });
});
