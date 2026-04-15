import type { ProviderPageMeta, ProviderPageSection } from '../catalog';

export const foundationAndContentSections: readonly ProviderPageSection[] = [
  'Foundation & Mission Control',
  'Content Structure & Teaching Creation',
];

export function getFoundationAndContentPages(pages: ProviderPageMeta[]) {
  return pages.filter((page) => foundationAndContentSections.includes(page.section));
}
