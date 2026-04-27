import { render, screen } from '@testing-library/react';
import TeachingsDashboardPage from '@/pages/provider/raw/FH-P-019_TeachingsDashboard';
import {
  publishEpisode,
  saveSeriesDraft,
} from './teachingFlowStore';

describe('Teachings dashboard integration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('reflects saved series and published episodes from the shared flow store', async () => {
    const unique = Date.now().toString();
    const seriesTitle = `Integration Series ${unique}`;
    const episodeTitle = `Integration Episode ${unique}`;

    const series = saveSeriesDraft({
      title: seriesTitle,
      subtitle: 'Integration subtitle for synced dashboard checks',
      description: 'Integration-level series description that should appear in synced dashboard records.',
      speaker: 'Integration Pastor',
      episodeTarget: 3,
      publishingState: 'Draft',
    });

    publishEpisode({
      title: episodeTitle,
      parentSeriesTitle: series.title,
      parentSeriesId: series.id,
      focusStatement: 'Integration focus statement used to verify dashboard visibility.',
      scripture: 'Romans 8',
      speaker: 'Integration Pastor',
      publishingState: 'Published',
    });

    render(<TeachingsDashboardPage />);

    expect(await screen.findByText(seriesTitle)).toBeInTheDocument();
    expect(await screen.findByText(episodeTitle)).toBeInTheDocument();
  }, 15000);
});
