import { render, screen, waitFor } from '@testing-library/react';
import SeriesBuilderPage from '@/pages/provider/raw/FH-P-020_SeriesBuilder';
import EpisodeBuilderPage from '@/pages/provider/raw/FH-P-021_EpisodeBuilder';
import {
  saveEpisodeDraft,
  saveSeriesDraft,
} from './teachingFlowStore';

describe('Builder URL preload', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState({}, '', '/');
  });

  it('preloads Series Builder draft by seriesId query param', async () => {
    const unique = Date.now().toString();
    const series = saveSeriesDraft({
      title: `Series Preload ${unique}`,
      subtitle: `Subtitle ${unique}`,
      description: `Description for preload ${unique} with enough detail.`,
      speaker: 'Preload Speaker',
      episodeTarget: 4,
      publishingState: 'Draft',
    });

    window.history.pushState({}, '', `/faithhub/provider/series-builder?seriesId=${encodeURIComponent(series.id)}`);
    render(<SeriesBuilderPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(series.title)).toBeInTheDocument();
    });
  });

  it('preloads Episode Builder draft by episodeId query param', async () => {
    const unique = Date.now().toString();
    const series = saveSeriesDraft({
      title: `Episode Parent ${unique}`,
      subtitle: 'Parent subtitle for preload',
      description: 'Parent description for preload integration.',
      speaker: 'Parent Speaker',
      episodeTarget: 3,
      publishingState: 'Draft',
    });

    const episode = saveEpisodeDraft({
      title: `Episode Preload ${unique}`,
      parentSeriesTitle: series.title,
      parentSeriesId: series.id,
      focusStatement: `Focus preload ${unique} ensures URL-based hydration works.`,
      scripture: 'Romans 12',
      speaker: 'Episode Speaker',
      publishingState: 'Draft',
    });

    window.history.pushState({}, '', `/faithhub/provider/episode-builder?episodeId=${encodeURIComponent(episode.id)}`);
    render(<EpisodeBuilderPage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue(episode.title)).toBeInTheDocument();
    });
  });
});
