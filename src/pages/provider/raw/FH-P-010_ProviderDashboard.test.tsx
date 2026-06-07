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
    expect(screen.getByText(/Services on the dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Task queue/i })).toBeInTheDocument();
    expect(screen.getByText(/Sunday Worship Livestream Support/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Service/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Campaign/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Upload Content/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Live Session/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Create Service/i }));
    expect(navigateMock).toHaveBeenCalledWith('/faithhub/provider/service-builder');
  });
});
