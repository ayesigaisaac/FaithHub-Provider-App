import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppLayout } from '@/layout/AppLayout';

vi.mock('@/layout/Sidebar', () => ({
  Sidebar: ({ onClose }: { onClose?: () => void }) => (
    <div>
      <p>Sidebar mock</p>
      {onClose ? (
        <button type="button" onClick={onClose}>
          Close sidebar
        </button>
      ) : null}
    </div>
  ),
}));

describe('AppLayout', () => {
  it('renders skip link and main content region', () => {
    render(
      <AppLayout>
        <h1>Dashboard Content</h1>
      </AppLayout>,
    );

    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText(/dashboard content/i)).toBeInTheDocument();
  });

  it('opens and closes mobile navigation dialog', async () => {
    const user = userEvent.setup();
    render(
      <AppLayout>
        <h1>Dashboard Content</h1>
      </AppLayout>,
    );

    await user.click(screen.getByRole('button', { name: /open navigation/i }));
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close navigation overlay/i }));
    expect(screen.queryByRole('dialog', { name: /mobile navigation/i })).not.toBeInTheDocument();
  });

  it('closes dialog on Escape key', async () => {
    const user = userEvent.setup();
    render(
      <AppLayout>
        <h1>Dashboard Content</h1>
      </AppLayout>,
    );

    await user.click(screen.getByRole('button', { name: /open navigation/i }));
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /mobile navigation/i })).not.toBeInTheDocument();
  });
});
