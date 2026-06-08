import { describe, expect, it } from 'vitest';
import ProviderRegistrationPage from './ProviderOnboarding';
import { ProviderRegistrationPage as JourneyProviderRegistrationPage } from '../FaithHubProviderJourneyPages';

describe('Provider registration page', () => {
  it('re-exports the provider registration page', () => {
    expect(ProviderRegistrationPage).toBe(JourneyProviderRegistrationPage);
  });
});
