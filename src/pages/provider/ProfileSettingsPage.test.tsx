import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProfileSettingsPage from './ProfileSettingsPage';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('Provider profile page', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    window.localStorage.clear();
  });

  it('submits the provider application', async () => {
    const user = userEvent.setup();

    render(<ProfileSettingsPage />);

    expect(screen.getByText(/Complete Provider Profile/i)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/Logo/i), 'faithhub-logo.png');
    await user.type(screen.getByLabelText(/Cover Image/i), 'faithhub-cover.png');
    await user.click(screen.getByRole('button', { name: /Submit Application/i }));

    expect(navigateMock).toHaveBeenCalledWith('/faithhub/provider/dashboard');
  });
});
