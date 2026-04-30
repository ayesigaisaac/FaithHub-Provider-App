import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppLayout } from '@/layout/AppLayout';

function renderLayout() {
  render(
    <MemoryRouter initialEntries={['/dashboard-ui']}>
      <AppLayout>
        <h1>Dashboard Content</h1>
      </AppLayout>
    </MemoryRouter>,
  );
}

describe('AppLayout', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('max-width'),
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders skip link and main content region', () => {
    renderLayout();

    expect(screen.getByRole('link', { name: /skip to main content/i })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText(/dashboard content/i)).toBeInTheDocument();
  });

  it('opens and closes mobile navigation dialog', async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole('button', { name: /open navigation/i }));
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /close navigation overlay/i }));
    expect(screen.queryByRole('dialog', { name: /mobile navigation/i })).not.toBeInTheDocument();
  });

  it('closes dialog on Escape key', async () => {
    const user = userEvent.setup();
    renderLayout();

    await user.click(screen.getByRole('button', { name: /open navigation/i }));
    expect(screen.getByRole('dialog', { name: /mobile navigation/i })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: /mobile navigation/i })).not.toBeInTheDocument();
  });
});
