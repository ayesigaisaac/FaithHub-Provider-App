import type { ProviderPageMeta, ProviderPageSection } from '../catalog';

export const providerJourneySections: readonly ProviderPageSection[] = ['Provider Journey'];

export function getProviderJourneyPages(pages: ProviderPageMeta[]) {
  return pages.filter((page) => providerJourneySections.includes(page.section));
}
