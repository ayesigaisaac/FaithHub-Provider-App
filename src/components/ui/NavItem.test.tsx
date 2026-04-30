import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { NavItem } from '@/components/ui/NavItem';

function renderNavItem(initialPathname: string, itemPath: string, onClose?: () => void) {
  return render(
    <MemoryRouter initialEntries={[initialPathname]}>
      <Routes>
        <Route path="*" element={<NavItem label="Overview" path={itemPath} onClose={onClose} />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('NavItem', () => {
  it('renders navigation button label', () => {
    renderNavItem('/faithhub/provider', '/faithhub/provider/dashboard');
    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
  });

  it('sets aria-current for active navigation items', () => {
    renderNavItem('/faithhub/provider/dashboard', '/faithhub/provider/dashboard');
    expect(screen.getByRole('button', { name: /overview/i })).toHaveAttribute('aria-current', 'page');
  });

  it('navigates to target path and invokes onClose callback', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderNavItem('/faithhub/provider', '/faithhub/provider/dashboard', onClose);

    const button = screen.getByRole('button', { name: /overview/i });
    await user.click(button);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('aria-current', 'page');
  });
});
