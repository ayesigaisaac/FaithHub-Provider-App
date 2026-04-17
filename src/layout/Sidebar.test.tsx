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

  it('renders Provider Modules dropdown with grouped navigation', () => {
    renderSidebar();

    expect(screen.getByRole('button', { name: /provider modules/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /core/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /content/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /teachings dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /live studio/i })).toBeInTheDocument();
  });

  it('marks current route as active', () => {
    renderSidebar('/faithhub/provider/live-schedule');
    const liveScheduleItems = screen.getAllByRole('button', { name: /live schedule/i });
    expect(liveScheduleItems.some((item) => item.getAttribute('aria-current') === 'page')).toBe(true);
  });

  it('navigates and closes mobile sidebar callback on selection', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderSidebar('/dashboard-ui', onClose);

    await user.click(screen.getByRole('button', { name: /events manager/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /events manager/i })).toHaveAttribute('aria-current', 'page');
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
});
