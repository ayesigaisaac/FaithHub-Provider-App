import { expect, test } from '@playwright/test';

test.describe('Public route visual baselines', () => {
  test('home landing', async ({ page }) => {
    await page.goto('/faithhub/home-landing');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-landing.png', { fullPage: true, animations: 'disabled' });
  });

  test('login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login-page.png', { fullPage: true, animations: 'disabled' });
  });

  test('not found page', async ({ page }) => {
    await page.goto('/route-that-does-not-exist');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('not-found-page.png', { fullPage: true, animations: 'disabled' });
  });
});

