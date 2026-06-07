import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProviderDashboardPage from './FH-P-010_ProviderDashboard';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('Provider dashboard', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    window.localStorage.clear();
  });

  it('shows the provider journey action rail', async () => {
    const user = userEvent.setup();

    render(<ProviderDashboardPage />);

    expect(screen.getByText(/FaithHub Dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Start here/i })).toBeInTheDocument();
    expect(screen.getByText(/Services on the dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Task queue/i })).toBeInTheDocument();
    expect(screen.getByText(/Sunday Worship Livestream Support/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Open profile/i }).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Create another service/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create another campaign/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open content upload/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open live session/i })).toBeInTheDocument();

    await user.click(screen.getAllByRole('button', { name: /Open profile/i })[0]);
    expect(navigateMock).toHaveBeenCalledWith('/faithhub/provider/profile-settings');
  });
});
