import { expect, test } from '@playwright/test';
import { seedMockAuth } from './helpers/authSeed';

const TOP_PROVIDER_ROUTES = [
  '/faithhub/provider/dashboard',
  '/faithhub/provider/teachings-dashboard',
  '/faithhub/provider/series-dashboard',
  '/faithhub/provider/series-builder',
  '/faithhub/provider/episode-builder',
  '/faithhub/provider/standalone-teaching-builder',
  '/faithhub/provider/live-dashboard',
  '/faithhub/provider/live-studio',
  '/faithhub/provider/audience-notifications',
  '/faithhub/provider/beacon-dashboard',
];

test.describe('Provider dark mode visual checklist', () => {
  test.beforeEach(async ({ page }) => {
    await seedMockAuth(page, { email: 'admin@faithhub.dev', onboardingStatus: 'approved' });
    await page.addInitScript(() => {
      localStorage.setItem('fh-provider-theme-mode', 'dark');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
  });

  for (const route of TOP_PROVIDER_ROUTES) {
    test(`dark mode route: ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const pageRoot = page.locator('main, [class*="min-h-screen"]').first();
      await expect(pageRoot).toBeVisible();

      await expect(page).toHaveScreenshot(
        `dark-${route.replaceAll('/', '_').replace(/^_+/, '')}.png`,
        { fullPage: true, animations: 'disabled' },
      );
    });
  }
});

