import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

describe('AppSidebar collapsed dock', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('(min-width: 1024px)'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });

  it('renders icons only when collapsed and restores the active section on expand', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/faithhub/provider/dashboard']}>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /collapse sidebar/i }));

    expect(screen.getByRole('button', { name: 'COMMUNITY' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'GIVING' })).toBeInTheDocument();
    expect(screen.queryByText('COMMUNITY')).not.toBeInTheDocument();
    expect(screen.queryByText('GIVING')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'COMMUNITY' }));

    expect(await screen.findByText('Community Groups')).toBeInTheDocument();
    expect(screen.getByText('Community Groups workspace tools')).toBeInTheDocument();
  });
});
