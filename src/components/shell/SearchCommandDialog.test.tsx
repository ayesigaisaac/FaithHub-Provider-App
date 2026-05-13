import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useState } from 'react';
import { vi } from 'vitest';
import { ThemeModeProvider } from '@/contexts/ThemeModeContext';
import { AuthProvider } from '@/auth/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SearchCommandDialog } from './SearchCommandDialog';

vi.mock('@/navigation/providerPages', () => {
  const TestIcon = () => null;
  const pages = Array.from({ length: 20 }).map((_, index) => ({
    key: `test-page-${index + 1}`,
    title: `Test Page ${index + 1}`,
    shortTitle: `Page ${index + 1}`,
    path: `/faithhub/provider/test-page-${index + 1}`,
    section: 'Foundation & Mission Control',
    description: `Test description ${index + 1}`,
    hidden: false,
    aliases: [],
    icon: TestIcon,
  }));
  return { providerPages: pages };
});

const AUTH_TOKEN_KEY = 'faithhub.auth.token';
const AUTH_WORKSPACE_KEY = 'faithhub.auth.workspace';

function seedAuthSession() {
  localStorage.setItem(AUTH_TOKEN_KEY, 'mock-token-navigation-test');
  localStorage.setItem(
    AUTH_WORKSPACE_KEY,
    JSON.stringify({
      campus: 'Kampala Central',
      brand: 'FaithHub',
    }),
  );
}

function renderDialog() {
  const DialogHarness = () => {
    const [query, setQuery] = useState('');
    return <SearchCommandDialog open onClose={() => undefined} query={query} onQueryChange={setQuery} />;
  };

  return render(
    <ThemeModeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MemoryRouter>
            <DialogHarness />
          </MemoryRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeModeProvider>,
  );
}

describe('SearchCommandDialog', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    seedAuthSession();
  });

  it('reveals additional page results only after selecting show more', async () => {
    renderDialog();

    fireEvent.change(
      screen.getByLabelText(/search commands and teachings/i),
      { target: { value: 'page' } },
    );

    const showMore = await screen.findByText(/show more pages/i);
    expect(showMore).toBeInTheDocument();
    expect(screen.queryByText(/show more pages/i)).toBeInTheDocument();

    fireEvent.click(showMore);

    expect(screen.queryByText(/show more pages/i)).not.toBeInTheDocument();
  });

  it('supports search filters and quick access rendering', async () => {
    renderDialog();

    expect(await screen.findByText(/quick access/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter actions/i, hidden: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filter pages/i, hidden: true })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /filter actions/i, hidden: true }));
    expect(screen.getByText(/open workflow dashboard/i)).toBeInTheDocument();
  });
});
