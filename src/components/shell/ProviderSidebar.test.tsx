import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProviderSidebar } from './ProviderSidebar';

vi.mock('@/navigation/providerPages', () => {
  const mockIcon = () => null;
  return {
    providerSections: ['Foundation & Mission Control'],
    providerPages: [
      { key: 'provider-dashboard', path: '/faithhub/provider/dashboard', aliases: [], icon: mockIcon },
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
        children: [],
      },
    ],
  };
});

describe('ProviderSidebar compact navigation', () => {
  beforeEach(() => {
    window.localStorage.clear();
    (window as unknown as { dataLayer?: Array<Record<string, string>> }).dataLayer = [];
  });

  it('renders navigation sections without bulky workflow cards', () => {
    render(
      <MemoryRouter initialEntries={['/faithhub/provider/dashboard']}>
        <ProviderSidebar open={false} onClose={() => undefined} collapsed={false} />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole('link', { name: /Dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.queryByRole('link', { name: /Teachings Dashboard/i })).not.toBeInTheDocument();
  });

  it('emits analytics payload for sidebar navigation click', () => {
    render(
      <MemoryRouter initialEntries={['/faithhub/provider/dashboard']}>
        <ProviderSidebar open={false} onClose={() => undefined} collapsed={false} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('link', { name: /Teachings Dashboard/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('link', { name: /Dashboard/i })[0]);

    const dataLayer = (window as unknown as { dataLayer?: Array<Record<string, string>> }).dataLayer ?? [];
    expect(dataLayer.some((entry) => entry.event === 'sidebar_task_click')).toBe(true);
  });
});
