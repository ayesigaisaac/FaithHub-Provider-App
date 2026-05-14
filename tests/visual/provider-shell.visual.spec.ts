import { expect, test } from '@playwright/test';
import { seedMockAuth } from './helpers/authSeed';

test.describe('Provider shell visual baselines', () => {
  test.beforeEach(async ({ page }) => {
    await seedMockAuth(page, { email: 'admin@faithhub.dev', onboardingStatus: 'approved' });
  });

  test('provider dashboard', async ({ page }) => {
    await page.goto('/faithhub/provider/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('provider-dashboard.png', { fullPage: true, animations: 'disabled' });
  });

  test('design system showcase', async ({ page }) => {
    await page.goto('/faithhub/provider/design-system-showcase');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('design-system-showcase.png', { fullPage: true, animations: 'disabled' });
  });

  test('analytics event health preview', async ({ page }) => {
    await page.goto('/faithhub/provider/analytics-event-health');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('analytics-event-health.png', { fullPage: true, animations: 'disabled' });
  });
});

