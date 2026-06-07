import { render, screen } from '@testing-library/react';
import EpisodeBuilderPage from './EpisodeBuilder';

describe('Episode Builder', () => {
  it('renders without crashing', () => {
    render(<EpisodeBuilderPage />);
    expect(screen.getAllByText(/Episode Builder/i).length).toBeGreaterThan(0);
  });
});


