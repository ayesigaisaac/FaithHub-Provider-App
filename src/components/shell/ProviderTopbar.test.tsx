import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeModeProvider } from '@/contexts/ThemeModeContext';
import { ProviderTopbar } from './ProviderTopbar';

vi.mock('@/auth/useAuth', () => ({
  useAuth: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    role: 'leadership',
    workspace: { campus: 'Kampala Central', brand: 'FaithHub' },
    onboardingStatus: 'pending',
    logout: vi.fn(async () => undefined),
    setWorkspace: vi.fn(),
  }),
}));

vi.mock('@/components/branding/BrandLogo', () => ({
  BrandLogo: () => <div>Brand</div>,
}));

function setScreenWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
  window.dispatchEvent(new Event('resize'));
}

function renderTopbar(onOpenSearch = vi.fn()) {
  return render(
    <ThemeModeProvider>
      <MemoryRouter>
        <ProviderTopbar
          onOpenSidebar={() => undefined}
          onOpenSearch={onOpenSearch}
          onCloseSearch={() => undefined}
          searchOpen={false}
          searchQuery=""
          onSearchQueryChange={() => undefined}
        />
      </MemoryRouter>
    </ThemeModeProvider>,
  );
}

describe('ProviderTopbar search trigger', () => {
  beforeEach(() => {
    window.matchMedia =
      window.matchMedia ||
      ((query: string) =>
        ({
          matches: query.includes('max-width') ? window.innerWidth <= 900 : false,
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }) as MediaQueryList);
  });

  it('mobile search button calls onOpenSearch with clicked anchor element', () => {
    setScreenWidth(375);
    const onOpenSearch = vi.fn();
    renderTopbar(onOpenSearch);

    const button = screen.getByRole('button', { name: /open search/i });
    fireEvent.click(button);

    expect(onOpenSearch).toHaveBeenCalledTimes(1);
    expect(onOpenSearch.mock.calls[0][0]).toBe(button);
  });

  it('mobile menu button calls onOpenSidebar', () => {
    setScreenWidth(375);
    const onOpenSidebar = vi.fn();

    render(
      <ThemeModeProvider>
        <MemoryRouter>
          <ProviderTopbar
            onOpenSidebar={onOpenSidebar}
            onOpenSearch={() => undefined}
            onCloseSearch={() => undefined}
            searchOpen={false}
            searchQuery=""
            onSearchQueryChange={() => undefined}
          />
        </MemoryRouter>
      </ThemeModeProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }));

    expect(onOpenSidebar).toHaveBeenCalledTimes(1);
  });
});
