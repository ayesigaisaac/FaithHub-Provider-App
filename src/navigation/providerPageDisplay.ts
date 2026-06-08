import type { ProviderPageMeta } from './providerPages';

const sidebarLabelOverrides: Record<string, string> = {
  'provider-onboarding': 'Provider Onboarding',
  'service-management': 'Services',
  'service-builder': 'Create Service',
  'campaign-management': 'Campaigns',
  'campaign-builder': 'Create Campaign',
  'content-upload': 'Content Upload',
  'asset-library': 'Asset Library',
  'provider-dashboard': 'Provider Dashboard',
  'charity-crowdfunding-workbench': 'Charity Crowdfunding',
  'channels-contact-manager': 'Channels & Contacts',
  'standalone-teaching-builder': 'Standalone Builder',
  'stream-to-platforms': 'Stream to Platforms',
  'live-session-details': 'Live Session Details',
  'waiting-room': 'Waiting Room',
  'reviews-and-moderation': 'Reviews & Moderation',
};

const sidebarHintOverrides: Record<string, string> = {
  'provider-dashboard': 'Start here for FaithHub metrics and actions',
  'provider-onboarding': 'Register and enter the FaithHub journey',
  'service-management': 'Review service cards and approval state',
  'service-builder': 'Create a new FaithHub service',
  'campaign-management': 'Track campaign windows and approvals',
  'campaign-builder': 'Build a campaign around approved services',
  'content-upload': 'Upload posters, videos, and banners',
  'asset-library': 'Select approved assets for live sessions',
  'series-dashboard': 'Manage series and publishing status',
  'teachings-dashboard': 'Create, review, and publish teachings',
  'live-dashboard': 'Run live sessions and monitor health',
  'live-session-details': 'Inspect the selected live session before previewing',
  'waiting-room': 'Preview the audience waiting room',
  'audience-notifications': 'Send updates to the right audience',
  'reviews-and-moderation': 'Handle reviews and moderation queue',
  'events-manager': 'Plan and run events',
  'donations-and-funds': 'Track giving and active campaigns',
  'profile-settings': 'Update account and FaithHub workspace preferences',
};

function cleanProviderPageTitle(title: string) {
  return title
    .replace(/^FaithHub Provider\s+/i, '')
    .replace(/\s+Workbench$/i, '')
    .trim();
}

export function getProviderPageSidebarLabel(page: Pick<ProviderPageMeta, 'key' | 'title' | 'shortTitle'>) {
  if (page.shortTitle) return page.shortTitle;
  return sidebarLabelOverrides[page.key] ?? cleanProviderPageTitle(page.title);
}

export function getProviderPageSidebarHint(page: Pick<ProviderPageMeta, 'key' | 'title' | 'description'>) {
  return sidebarHintOverrides[page.key] ?? `${cleanProviderPageTitle(page.title)} FaithHub tools`;
}

export function getProviderPageSearchTitle(page: Pick<ProviderPageMeta, 'title' | 'shortTitle'>) {
  return page.shortTitle ?? page.title;
}
