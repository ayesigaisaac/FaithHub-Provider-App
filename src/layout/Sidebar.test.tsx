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
  it('renders Core and Content grouped navigation', () => {
    renderSidebar();

    expect(screen.getByRole('heading', { name: /core/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /content/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /teachings/i })).toBeInTheDocument();
  });

  it('marks current route as active', () => {
    renderSidebar('/faithhub/provider/live-schedule');
    expect(screen.getByRole('button', { name: /schedule/i })).toHaveAttribute('aria-current', 'page');
  });

  it('navigates and closes mobile sidebar callback on selection', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderSidebar('/dashboard-ui', onClose);

    await user.click(screen.getByRole('button', { name: /campaigns/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /campaigns/i })).toHaveAttribute('aria-current', 'page');
  });
});
