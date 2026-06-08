import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Sidebar } from '@/layout/Sidebar';

function renderSidebar(initialPath = '/dashboard-ui', onClose?: () => void) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Sidebar onClose={onClose} />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Provider Modules dropdown with grouped navigation', () => {
    renderSidebar();

    expect(screen.getByRole('button', { name: /provider modules/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /continue/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /community/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /continue editing/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /workflow dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /community groups/i })).toBeInTheDocument();
  });

  it('marks current route as active', () => {
    renderSidebar('/faithhub/provider/live-schedule');
    expect(screen.getByRole('link', { name: /publish schedule/i })).toHaveAttribute('aria-current', 'page');
  });

  it('navigates and closes mobile sidebar callback on selection', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderSidebar('/dashboard-ui', onClose);

    await user.click(screen.getByRole('link', { name: /community groups/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('link', { name: /community groups/i })).toHaveAttribute('aria-current', 'page');
  });

  it('collapses and expands provider modules list', async () => {
    const user = userEvent.setup();
    renderSidebar('/dashboard-ui');

    const trigger = screen.getByRole('button', { name: /provider modules/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not crash when localStorage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    renderSidebar('/dashboard-ui');

    expect(screen.getByRole('button', { name: /provider modules/i })).toBeInTheDocument();
  });
});
