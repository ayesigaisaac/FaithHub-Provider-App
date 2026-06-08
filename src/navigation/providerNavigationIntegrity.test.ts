import { buttonActionRegistry } from '@/navigation/buttonActions';
import { getKnownProviderPaths, providerPages } from '@/navigation/providerPages';
import { topbarTabs } from '@/navigation/topbarTabs';

describe('provider navigation integrity', () => {
  it('includes Content Planner in provider navigation metadata', () => {
    const contentPlannerPage = providerPages.find((page) => page.key === 'content-planner');
    expect(contentPlannerPage).toBeTruthy();
    expect(contentPlannerPage?.path).toBe('/faithhub/provider/content-planner');
    expect(contentPlannerPage?.hidden).not.toBe(true);
  });

  it('ensures topbar tabs point to registered provider routes', () => {
    const knownPaths = getKnownProviderPaths();
    knownPaths.add('/faithhub/provider');
    topbarTabs.forEach((tab) => {
      expect(knownPaths.has(tab.to)).toBe(true);
    });
  });

  it('ensures button action navigate targets resolve to registered provider routes', () => {
    const knownPaths = getKnownProviderPaths();
    knownPaths.add('/faithhub/provider');
    Object.entries(buttonActionRegistry).forEach(([actionId, action]) => {
      if (action.kind !== 'navigate') return;
      expect(knownPaths.has(action.targetPath)).toBe(true);
      expect(action.targetPath, `missing route for ${actionId}`).toBeTruthy();
    });
  });
});
