import { buttonActionRegistry } from '@/navigation/buttonActions';
import { providerPages } from '@/navigation/providerPages';
import { topbarTabs } from '@/navigation/topbarTabs';

function knownProviderPaths() {
  const paths = new Set<string>();
  providerPages.forEach((page) => {
    paths.add(page.path);
    page.aliases?.forEach((alias) => paths.add(alias));
  });
  paths.add('/faithhub/provider');
  return paths;
}

describe('provider navigation integrity', () => {
  it('ensures topbar tabs point to registered provider routes', () => {
    const knownPaths = knownProviderPaths();
    topbarTabs.forEach((tab) => {
      expect(knownPaths.has(tab.to)).toBe(true);
    });
  });

  it('ensures button action navigate targets resolve to registered provider routes', () => {
    const knownPaths = knownProviderPaths();
    Object.entries(buttonActionRegistry).forEach(([actionId, action]) => {
      if (action.kind !== 'navigate') return;
      expect(knownPaths.has(action.targetPath)).toBe(true);
      expect(action.targetPath, `missing route for ${actionId}`).toBeTruthy();
    });
  });
});
