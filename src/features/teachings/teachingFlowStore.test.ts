import {
  getTeachingFlowState,
  publishEpisode,
  publishSeries,
  saveEpisodeDraft,
  saveSeriesDraft,
  validateEpisodeDraft,
  validateSeriesDraft,
} from './teachingFlowStore';

describe('teachingFlowStore', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('validates series and episode inputs', () => {
    expect(
      validateSeriesDraft({
        title: 'A',
        subtitle: 'short',
        description: 'too short',
        speaker: '',
      }),
    ).toHaveLength(4);

    expect(
      validateEpisodeDraft({
        title: 'A',
        parentSeriesTitle: '',
        focusStatement: 'short',
        scripture: '',
      }),
    ).toHaveLength(4);
  });

  it('saves and publishes series records', () => {
    const draft = saveSeriesDraft({
      title: 'Faith and Work',
      subtitle: 'How to live faithfully in daily work',
      description: 'A practical series on vocation, witness, and excellence in everyday work.',
      speaker: 'Pastor James',
      episodeTarget: 5,
      publishingState: 'Draft',
    });

    expect(draft.id).toBeTruthy();
    expect(getTeachingFlowState().series[0]?.publishingState).toBe('Draft');

    const published = publishSeries({
      ...draft,
      publishingState: 'Published',
    });

    expect(published.id).toBe(draft.id);
    expect(getTeachingFlowState().series[0]?.publishingState).toBe('Published');
  });

  it('links episodes to a saved series when names match', () => {
    const series = saveSeriesDraft({
      title: 'Renewal Journey',
      subtitle: 'Six weeks of renewal',
      description: 'A six-week discipleship path focused on prayer and spiritual renewal.',
      speaker: 'Pastor Ruth',
      episodeTarget: 6,
      publishingState: 'Draft',
    });

    const episode = saveEpisodeDraft({
      title: 'Week 1: Return',
      parentSeriesTitle: 'Renewal Journey',
      focusStatement: 'Call people back to prayer and surrender in practical ways.',
      scripture: 'Romans 12',
      speaker: 'Pastor Ruth',
      publishingState: 'Draft',
    });

    expect(episode.parentSeriesId).toBe(series.id);

    publishEpisode({
      ...episode,
      publishingState: 'Published',
    });

    expect(getTeachingFlowState().episodes[0]?.publishingState).toBe('Published');
  });
});
