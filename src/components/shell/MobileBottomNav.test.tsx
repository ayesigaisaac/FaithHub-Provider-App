import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MobileBottomNav } from './MobileBottomNav';

const navigateSpy = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/faithhub/provider/live-dashboard',
      search: '',
      hash: '',
      state: null,
      key: 'test',
    }),
    useNavigate: () => navigateSpy,
  };
});

vi.mock('@/navigation/providerPages', () => ({
  findProviderPageByPath: (pathname: string) => ({ path: pathname, section: 'Live Sessions Operations', aliases: [] }),
}));

describe('MobileBottomNav', () => {
  it('routes to the tapped tab', async () => {
    const user = userEvent.setup();

    render(<MobileBottomNav />);

    await user.click(screen.getByRole('button', { name: 'Services' }));

    expect(navigateSpy).toHaveBeenCalledWith('/faithhub/provider/services');
  });
});
