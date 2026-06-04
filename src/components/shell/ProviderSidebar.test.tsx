import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProviderSidebar } from './ProviderSidebar';

vi.mock('@/navigation/providerPages', () => {
  const mockIcon = () => null;
  return {
    providerSections: ['Foundation & Mission Control'],
    providerPages: [
      { key: 'provider-dashboard', path: '/faithhub/provider/dashboard', aliases: [], icon: mockIcon, section: 'Foundation & Mission Control' },
      { key: 'teachings-dashboard', path: '/faithhub/provider/teachings-dashboard', aliases: [], icon: mockIcon, section: 'Foundation & Mission Control' },
    ],
    getProviderSidebarGroupsBySection: () => [
      {
        page: {
          key: 'provider-dashboard',
          title: 'FaithHub Provider Dashboard',
          shortTitle: 'Dashboard',
          path: '/faithhub/provider/dashboard',
          aliases: [],
          icon: mockIcon,
        },
        children: [
          {
            key: 'teachings-dashboard',
            title: 'Teachings Dashboard',
            path: '/faithhub/provider/teachings-dashboard',
            aliases: [],
            icon: mockIcon,
          },
        ],
      },
    ],
  };
});

function SidebarHarness() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <MemoryRouter initialEntries={['/faithhub/provider/dashboard']}>
      <ProviderSidebar
        open={false}
        onClose={() => undefined}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />
    </MemoryRouter>
  );
}

describe('ProviderSidebar collapsed dock', () => {
  beforeEach(() => {
    window.localStorage.clear();
    (window as unknown as { dataLayer?: Array<Record<string, string>> }).dataLayer = [];
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('(min-width:900px)'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });

  it('renders an icon-only dock when collapsed', () => {
    render(
      <MemoryRouter initialEntries={['/faithhub/provider/dashboard']}>
        <ProviderSidebar open={false} onClose={() => undefined} collapsed />
      </MemoryRouter>,
    );

    expect(screen.getByRole('button', { name: 'Foundation' })).toBeInTheDocument();
    expect(screen.queryByText('Foundation')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Teachings Dashboard')).not.toBeInTheDocument();
  });

  it('expands and opens the matching section when an icon is clicked', async () => {
    const user = userEvent.setup();
    render(<SidebarHarness />);

    await user.click(screen.getByRole('button', { name: 'Foundation' }));

    expect(await screen.findByRole('button', { name: /Collapse Foundation section/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Dashboard /i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Teachings Dashboard/i })).toBeInTheDocument();
  });

  it('emits analytics payload for sidebar navigation click', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/faithhub/provider/dashboard']}>
        <ProviderSidebar open={false} onClose={() => undefined} collapsed={false} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('link', { name: /Teachings Dashboard/i }));

    const dataLayer = (window as unknown as { dataLayer?: Array<Record<string, string>> }).dataLayer ?? [];
    expect(dataLayer.some((entry) => entry.event === 'sidebar_task_click')).toBe(true);
  });
});
