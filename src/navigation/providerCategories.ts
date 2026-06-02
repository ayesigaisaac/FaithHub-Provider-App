import type { ProviderPageSection } from './provider-pages/catalog';

export type ProviderCategoryMeta = {
  section: ProviderPageSection;
  navLabel: string;
};

export const providerCategoryMeta: ProviderCategoryMeta[] = [
  { section: 'Foundation & Mission Control', navLabel: 'Foundation' },
  { section: 'Content Structure & Teaching Creation', navLabel: 'Content' },
  { section: 'Provider Journey', navLabel: 'Journey' },
  { section: 'Live Sessions Operations', navLabel: 'Live Ops' },
  { section: 'Audience & Outreach', navLabel: 'Audience' },
  { section: 'Post-live & Trust', navLabel: 'Post-live' },
  { section: 'Events & Giving', navLabel: 'Giving' },
  { section: 'Revelight', navLabel: 'Revelight' },
  { section: 'Community & Care', navLabel: 'Community' },
  { section: 'Leadership & Team', navLabel: 'Leadership' },
  { section: 'Workspace Settings', navLabel: 'Settings' },
  { section: 'Previews', navLabel: 'Previews' },
];

export const providerSections: ProviderPageSection[] = providerCategoryMeta.map((item) => item.section);

export const providerCategoryBySection = providerCategoryMeta.reduce<Record<ProviderPageSection, ProviderCategoryMeta>>(
  (acc, item) => {
    acc[item.section] = item;
    return acc;
  },
  {} as Record<ProviderPageSection, ProviderCategoryMeta>,
);
