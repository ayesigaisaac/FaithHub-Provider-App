export const ROUTES = {
  dashboard: '/',
  series: '/series',
  teachings: '/teachings',
  liveNew: '/live/new',
  teachingNew: '/teaching/new',
  campaigns: '/campaigns',
  ads: '/ads',
} as const;

export const SIDEBAR_ROUTES = [
  { label: 'Dashboard', path: ROUTES.dashboard },
  { label: 'Series', path: ROUTES.series },
  { label: 'Teachings', path: ROUTES.teachings },
  { label: 'Campaigns', path: ROUTES.campaigns },
  { label: 'Ads', path: ROUTES.ads },
] as const;
