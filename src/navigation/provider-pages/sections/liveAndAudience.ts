import type { ProviderPageMeta, ProviderPageSection } from '../catalog';

export const liveAndAudienceSections: readonly ProviderPageSection[] = [
  'Live Sessions Operations',
  'Audience & Outreach',
  'Post-live & Trust',
];

export function getLiveAndAudiencePages(pages: ProviderPageMeta[]) {
  return pages.filter((page) => liveAndAudienceSections.includes(page.section));
}
