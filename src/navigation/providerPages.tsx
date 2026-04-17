import {
  providerPageCatalog,
  type ProviderPageMeta,
  type ProviderPageSection,
} from './provider-pages/catalog';
import { getFoundationAndContentPages } from './provider-pages/sections/foundationAndContent';
import { getLiveAndAudiencePages } from './provider-pages/sections/liveAndAudience';
import { getGrowthAndCommunityPages } from './provider-pages/sections/growthAndCommunity';
import { getSettingsAndPreviewPages } from './provider-pages/sections/settingsAndPreviews';

export type { ProviderPageMeta, ProviderPageSection };

export const providerSections: ProviderPageSection[] = [
  'Foundation & Mission Control',
  'Content Structure & Teaching Creation',
  'Live Sessions Operations',
  'Audience & Outreach',
  'Post-live & Trust',
  'Events & Giving',
  'Beacon',
  'Community & Care',
  'Leadership & Team',
  'Workspace Settings',
  'Previews',
];

export const providerPages: ProviderPageMeta[] = [
  ...getFoundationAndContentPages(providerPageCatalog),
  ...getLiveAndAudiencePages(providerPageCatalog),
  ...getGrowthAndCommunityPages(providerPageCatalog),
  ...getSettingsAndPreviewPages(providerPageCatalog),
];

const knownProviderPaths = new Set<string>();
providerPages.forEach((page) => {
  knownProviderPaths.add(page.path);
  page.aliases?.forEach((alias) => knownProviderPaths.add(alias));
});

export function findProviderPageByPath(pathname: string) {
  return providerPages.find((page) => page.path === pathname || page.aliases?.includes(pathname));
}

export function getProviderPagesBySection(section: ProviderPageSection) {
  return providerPages.filter((page) => page.section === section && !page.hidden);
}

export function isKnownProviderPath(pathname: string) {
  return knownProviderPaths.has(pathname);
}

export function resolveKnownProviderPath(pathname: string, fallback = '/faithhub/provider/dashboard') {
  return isKnownProviderPath(pathname) ? pathname : fallback;
}
