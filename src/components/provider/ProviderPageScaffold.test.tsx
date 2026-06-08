import { render, screen } from '@testing-library/react';
import { ProviderPageScaffold } from './ProviderPageScaffold';

describe('ProviderPageScaffold', () => {
  it('renders the default eyebrow and page content', () => {
    render(
      <ProviderPageScaffold icon={<span>Icon</span>} title="Title" subtitle="Subtitle">
        <div>Body</div>
      </ProviderPageScaffold>,
    );

    expect(screen.getByText(/faithhub provider/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByText(/body/i)).toBeInTheDocument();
  });

  it('renders a custom eyebrow when provided', () => {
    render(
      <ProviderPageScaffold icon={<span>Icon</span>} title="Title" subtitle="Subtitle" eyebrow="Workspace">
        <div>Body</div>
      </ProviderPageScaffold>,
    );

    expect(screen.getByText(/workspace/i)).toBeInTheDocument();
    expect(screen.queryByText(/faithhub provider/i)).not.toBeInTheDocument();
  });
});
