import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import { NotificationProvider } from './contexts/NotificationContext';
import { theme } from './theme';

function renderApp(initialEntries: string[]) {
  return render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <App />
        </MemoryRouter>
      </NotificationProvider>
    </ThemeProvider>,
  );
}

describe('App smoke routing', () => {
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
    const brandMatches = await screen.findAllByText(/FAITHHUB/i);
    expect(brandMatches.length).toBeGreaterThan(0);
  });

  it('renders key provider navigation elements', async () => {
    renderApp(['/faithhub/provider/dashboard']);
    expect(await screen.findByRole('button', { name: /quick filters/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search providers, streams, reports/i)).toBeInTheDocument();
  });
});
