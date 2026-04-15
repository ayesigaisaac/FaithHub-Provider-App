import type { ProviderPageMeta, ProviderPageSection } from '../catalog';

export const settingsAndPreviewSections: readonly ProviderPageSection[] = ['Workspace Settings', 'Previews'];

export function getSettingsAndPreviewPages(pages: ProviderPageMeta[]) {
  return pages.filter((page) => settingsAndPreviewSections.includes(page.section));
}
