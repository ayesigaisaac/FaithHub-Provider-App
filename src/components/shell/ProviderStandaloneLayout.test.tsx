import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProviderStandaloneLayout } from './ProviderStandaloneLayout';

const sidebarSpy = vi.fn();

vi.mock('./ProviderSidebar', () => ({
  ProviderSidebar: (props: { open: boolean; collapsed: boolean; onToggleCollapse: () => void }) => {
    sidebarSpy(props);
    return (
      <div data-testid="provider-sidebar" data-open={String(props.open)} data-collapsed={String(props.collapsed)}>
        <button type="button" onClick={props.onToggleCollapse}>
          toggle
        </button>
      </div>
    );
  },
}));

vi.mock('./MobileBottomNav', () => ({
  MobileBottomNav: () => <div data-testid="mobile-bottom-nav" />,
}));

vi.mock('./SearchCommandDialog', () => ({
  SearchCommandDialog: ({ open }: { open: boolean }) => <div data-testid="search-dialog" data-open={String(open)} />,
}));

vi.mock('@/components/ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/components/MediaFallbackContainer', () => ({
  MediaFallbackContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/navigation/providerPages', () => ({
  findProviderPageByPath: (path: string) => ({
    path,
    title: path.includes('profile-settings') ? 'Profile Settings' : 'FaithHub Provider Dashboard',
  }),
}));

function renderLayout() {
  return render(
    <MemoryRouter initialEntries={['/faithhub/provider/dashboard']}>
      <ProviderStandaloneLayout pageTitle="Standalone Workspace">
        <div>Workspace Content</div>
      </ProviderStandaloneLayout>
    </MemoryRouter>,
  );
}

describe('ProviderStandaloneLayout', () => {
  beforeEach(() => {
    window.localStorage.clear();
    sidebarSpy.mockClear();
  });

  it('restores the collapsed state and expands the sidebar from the mobile entry point', async () => {
    const user = userEvent.setup();
    window.localStorage.setItem('faithhub.sidebar.collapsed', 'true');

    renderLayout();

    expect(screen.getByTestId('provider-sidebar')).toHaveAttribute('data-collapsed', 'true');
    expect(screen.getByTestId('provider-sidebar')).toHaveAttribute('data-open', 'false');
    expect(screen.getByTestId('mobile-bottom-nav')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /open navigation/i }));

    expect(screen.getByTestId('provider-sidebar')).toHaveAttribute('data-open', 'true');
  });
});
