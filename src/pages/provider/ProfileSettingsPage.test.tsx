import { describe, expect, it } from 'vitest';
import ProfileSettingsPage from './ProfileSettingsPage';
import { ProviderProfilePage } from './FaithHubProviderJourneyPages';

describe('Provider profile page', () => {
  it('re-exports the provider profile page', () => {
    expect(ProfileSettingsPage).toBe(ProviderProfilePage);
  });
});
