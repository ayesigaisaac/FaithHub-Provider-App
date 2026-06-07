import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import App from './App';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import { AuthProvider } from '@/auth/AuthContext';

const AUTH_TOKEN_KEY = 'faithhub.auth.token';
const AUTH_WORKSPACE_KEY = 'faithhub.auth.workspace';

function seedAuthSession() {
  localStorage.setItem(AUTH_TOKEN_KEY, 'mock-token-leadership@faithhub.dev');
  localStorage.setItem(
    AUTH_WORKSPACE_KEY,
    JSON.stringify({
      campus: 'Kampala Central',
      brand: 'FaithHub',
    }),
  );
}

function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location-probe">
      {location.pathname}
      {location.search}
      {location.hash}
    </div>
  );
}

function renderApp(initialEntries: string[]) {
  seedAuthSession();

  return render(
    <ThemeModeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <App />
            <LocationProbe />
          </MemoryRouter>
        </NotificationProvider>
      </AuthProvider>
    </ThemeModeProvider>,
  );
}

describe('App smoke routing', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the app successfully', async () => {
    renderApp(['/faithhub/home-landing']);
    expect(await screen.findByText(/FaithHub Dashboard/i)).toBeInTheDocument();
  });

  it('shows NotFound for unknown routes', async () => {
    renderApp(['/does-not-exist']);
    expect(await screen.findByText(/That route does not exist yet/i)).toBeInTheDocument();
  });

  it('mounts provider shell routes', async () => {
    renderApp(['/faithhub/provider/dashboard']);
    expect(
      await screen.findByRole(
        'searchbox',
        { name: /search/i },
        { timeout: 15000 },
      ),
    ).toBeInTheDocument();
  }, 15000);

  it('renders key provider navigation elements', async () => {
    renderApp(['/faithhub/provider/dashboard']);
    expect(
      await screen.findByRole('searchbox', { name: /search/i }, { timeout: 15000 }),
    ).toBeInTheDocument();
    const dashboardLinks = await screen.findAllByRole('link', { name: /dashboard/i }, { timeout: 15000 });
    expect(dashboardLinks.length).toBeGreaterThan(0);
  }, 15000);

  it('redirects alias routes to canonical provider paths while preserving query/hash', async () => {
    renderApp(['/faithhub/provider/donations-funds?tab=overview#giving']);
    expect(await screen.findByTestId('location-probe')).toHaveTextContent('/faithhub/provider/donations-and-funds?tab=overview#giving');
  }, 15000);

  it('redirects unknown provider routes to dashboard', async () => {
    renderApp(['/faithhub/provider/not-a-real-page']);
    expect(await screen.findByTestId('location-probe')).toHaveTextContent('/faithhub/provider/dashboard');
  }, 15000);
});
