import type { Page } from '@playwright/test';

type AuthSeedOptions = {
  email?: string;
  onboardingStatus?: 'not_started' | 'in_progress' | 'submitted' | 'approved';
  workspace?: { campus: string; brand: string };
};

export async function seedMockAuth(page: Page, options: AuthSeedOptions = {}) {
  const email = options.email ?? 'admin@faithhub.dev';
  const token = `mock-token-${email}`;
  const workspace = options.workspace ?? { campus: 'Kampala Central', brand: 'FaithHub' };
  const onboardingStatus = options.onboardingStatus ?? 'approved';

  await page.addInitScript(
    ({ t, w, s }) => {
      window.localStorage.setItem('faithhub.auth.token', t);
      window.localStorage.setItem('faithhub.auth.workspace', JSON.stringify(w));
      window.localStorage.setItem('faithhub.provider.onboarding.status', s);
    },
    { t: token, w: workspace, s: onboardingStatus },
  );
}

