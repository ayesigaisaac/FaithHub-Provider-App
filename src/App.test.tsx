import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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

function renderApp(initialEntries: string[]) {
  seedAuthSession();

  return render(
    <ThemeModeProvider>
      <AuthProvider>
        <NotificationProvider>
          <MemoryRouter initialEntries={initialEntries}>
            <App />
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
    expect(await screen.findByText(/A premium digital home for faith, teaching, community, and giving/i)).toBeInTheDocument();
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
    expect(await screen.findByRole('searchbox', { name: /search pages/i })).toBeInTheDocument();
    const dashboardButtons = await screen.findAllByRole('button', { name: /dashboard/i });
    expect(dashboardButtons.length).toBeGreaterThan(0);
  });
});
