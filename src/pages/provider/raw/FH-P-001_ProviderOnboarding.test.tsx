import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProviderRegistrationPage from './FH-P-001_ProviderOnboarding';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('Provider registration page', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    window.localStorage.clear();
  });

  it('saves a draft and continues to profile completion', async () => {
    const user = userEvent.setup();

    render(<ProviderRegistrationPage />);

    expect(screen.getByText(/Provider Registration/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Save Draft/i }));
    expect(screen.getByText(/Registration draft saved/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Password/i), 'faithhub-123');
    await user.click(screen.getByRole('button', { name: /Register/i }));

    expect(navigateMock).toHaveBeenCalledWith('/faithhub/provider/profile-settings');
  }, 15000);
});
