import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import LiveDashboardPage from './FH-P-032_LiveDashboard';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('Live dashboard', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    window.localStorage.clear();
  });

  it('opens the waiting room from the selected live session', async () => {
    const user = userEvent.setup();

    render(<LiveDashboardPage />);

    expect(screen.getByText(/Live Session Management/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Live Session/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Preview Waiting Room/i }));
    expect(navigateMock).toHaveBeenCalledWith('/faithhub/provider/waiting-room');
  });
});
