import type { ProviderPageMeta, ProviderPageSection } from '../catalog';

export const growthAndCommunitySections: readonly ProviderPageSection[] = [
  'Events & Giving',
  'Revelight',
  'Community & Care',
  'Leadership & Team',
];

export function getGrowthAndCommunityPages(pages: ProviderPageMeta[]) {
  return pages.filter((page) => growthAndCommunitySections.includes(page.section));
}
