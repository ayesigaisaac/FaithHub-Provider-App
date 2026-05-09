import {
  providerPageCatalog,
  type ProviderPageMeta,
  type ProviderPageSection,
} from './provider-pages/catalog';
import { getFoundationAndContentPages } from './provider-pages/sections/foundationAndContent';
import { getLiveAndAudiencePages } from './provider-pages/sections/liveAndAudience';
import { getGrowthAndCommunityPages } from './provider-pages/sections/growthAndCommunity';
import { getSettingsAndPreviewPages } from './provider-pages/sections/settingsAndPreviews';
import { providerSections as orderedProviderSections } from './providerCategories';

export type { ProviderPageMeta, ProviderPageSection };

export const providerSections: ProviderPageSection[] = orderedProviderSections;

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

export type ProviderSidebarGroup = {
  page: ProviderPageMeta;
  children: ProviderPageMeta[];
};

export function getProviderSidebarGroupsBySection(section: ProviderPageSection): ProviderSidebarGroup[] {
  const pages = getProviderPagesBySection(section);
  const byKey = new Map(pages.map((page) => [page.key, page]));
  const buildersByParent = new Map<string, ProviderPageMeta[]>();
  const primary: ProviderPageMeta[] = [];

  pages.forEach((page) => {
    if (page.navPlacement === 'builder' && page.parentKey && byKey.has(page.parentKey)) {
      const siblings = buildersByParent.get(page.parentKey) ?? [];
      siblings.push(page);
      buildersByParent.set(page.parentKey, siblings);
      return;
    }
    primary.push(page);
  });

  return primary.map((page) => ({
    page,
    children: buildersByParent.get(page.key) ?? [],
  }));
}

export function isKnownProviderPath(pathname: string) {
  return knownProviderPaths.has(pathname);
}

export function resolveKnownProviderPath(pathname: string, fallback = '/faithhub/provider/dashboard') {
  return isKnownProviderPath(pathname) ? pathname : fallback;
}
