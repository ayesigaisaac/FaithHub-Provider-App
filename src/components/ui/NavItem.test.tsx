import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home } from 'lucide-react';
import { NavItem } from '@/components/ui/NavItem';

describe('NavItem', () => {
  it('renders label, hint, and badge', () => {
    render(
      <NavItem
        icon={<Home className="h-5 w-5" />}
        label="Overview"
        hint="Global workspace pulse"
        badge="3"
      />,
    );

    expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
    expect(screen.getByText(/global workspace pulse/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('sets aria-current for active navigation items', () => {
    render(<NavItem icon={<Home className="h-5 w-5" />} label="Overview" active />);
    expect(screen.getByRole('button', { name: /overview/i })).toHaveAttribute('aria-current', 'page');
  });

  it('invokes click handler', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<NavItem icon={<Home className="h-5 w-5" />} label="Overview" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: /overview/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
