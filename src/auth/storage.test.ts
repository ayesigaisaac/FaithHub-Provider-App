import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_ONBOARDING_DRAFT,
  clearStoredOnboardingDraft,
  clearStoredOnboardingStatus,
  getStoredOnboardingDraft,
  getStoredOnboardingStatus,
  setStoredOnboardingDraft,
  setStoredOnboardingStatus,
} from './storage';

describe('onboarding storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('returns default draft when none is stored', () => {
    expect(getStoredOnboardingDraft()).toEqual(DEFAULT_ONBOARDING_DRAFT);
  });

  it('persists and restores draft values', () => {
    const draft = {
      ...DEFAULT_ONBOARDING_DRAFT,
      organizationName: 'FaithHub Kampala',
      contactEmail: 'hello@faithhub.dev',
      mission: 'To disciple people through teaching and community care.',
      agreedToTerms: true,
    };

    setStoredOnboardingDraft(draft);
    expect(getStoredOnboardingDraft()).toEqual(draft);

    clearStoredOnboardingDraft();
    expect(getStoredOnboardingDraft()).toEqual(DEFAULT_ONBOARDING_DRAFT);
  });

  it('defaults onboarding status safely', () => {
    expect(getStoredOnboardingStatus()).toBe('not_started');

    setStoredOnboardingStatus('in_progress');
    expect(getStoredOnboardingStatus()).toBe('in_progress');

    setStoredOnboardingStatus('approved');
    expect(getStoredOnboardingStatus()).toBe('approved');

    clearStoredOnboardingStatus();
    expect(getStoredOnboardingStatus()).toBe('not_started');
  });
});
