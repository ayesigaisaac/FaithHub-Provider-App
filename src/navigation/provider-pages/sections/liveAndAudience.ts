import type { ProviderPageMeta, ProviderPageSection } from '../catalog';

export const liveAndAudienceSections: readonly ProviderPageSection[] = [
  'Live Sessionz Operations',
  'Audience & Outreach',
  'Post-live & Trust',
];

export function getLiveAndAudiencePages(pages: ProviderPageMeta[]) {
  return pages.filter((page) => liveAndAudienceSections.includes(page.section));
}
