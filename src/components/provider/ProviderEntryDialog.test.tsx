import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { ProviderEntryDialog } from './ProviderEntryDialog';

function DialogHarness() {
  const [open, setOpen] = useState(true);

  return (
    <ProviderEntryDialog
      open={open}
      onClose={() => setOpen(false)}
      title="Create resource"
      subtitle="Use this form to feed the system with new data."
      helperText="This is a focused data-entry session."
      actions={<button type="button">Save</button>}
    >
      <div>Dialog body</div>
    </ProviderEntryDialog>
  );
}

describe('ProviderEntryDialog', () => {
  it('renders a data entry session with accessible title and close action', () => {
    render(<DialogHarness />);

    expect(screen.getByRole('dialog', { name: /create resource/i })).toBeInTheDocument();
    expect(screen.getByText(/data entry session active/i)).toBeInTheDocument();
    expect(screen.getByText(/dialog body/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /close dialog/i }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
