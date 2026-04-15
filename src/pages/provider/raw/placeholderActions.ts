import type { MouseEvent } from 'react';

function normalizeLabel(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function go(path: string): void {
  window.location.assign(path);
}

function setPreviewMode(mode: 'desktop' | 'mobile'): void {
  localStorage.setItem('faithhub.preview.mode', mode);
  document.documentElement.dataset.previewMode = mode;
}

async function copyCurrentLink(): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(window.location.href);
    return;
  }

  // Fallback for older browser contexts.
  const temp = document.createElement('textarea');
  temp.value = window.location.href;
  temp.setAttribute('readonly', 'true');
  temp.style.position = 'fixed';
  temp.style.opacity = '0';
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
}

export async function handleRawPlaceholderAction(event: MouseEvent<HTMLButtonElement>): Promise<void> {
  const label = normalizeLabel(event.currentTarget.textContent ?? '');

  if (!label) {
    go('/faithhub/provider/dashboard');
    return;
  }

  if (label.includes('desktop')) {
    setPreviewMode('desktop');
    return;
  }

  if (label.includes('mobile')) {
    setPreviewMode('mobile');
    return;
  }

  if (label.includes('share')) {
    await copyCurrentLink();
    return;
  }

  if (label.includes('give') || label.includes('donat')) {
    go('/faithhub/provider/donations-and-funds');
    return;
  }

  if (label.includes('crowdfund')) {
    go('/faithhub/provider/charity-crowdfunding-workbench');
    return;
  }

  if (label.includes('join') || label.includes('watch') || label.includes('trailer') || label.includes('live')) {
    go('/faithhub/provider/live-dashboard');
    return;
  }

  if (label.includes('prayer')) {
    go('/faithhub/provider/prayer-requests');
    return;
  }

  if (label.includes('resource') || label.includes('note') || label.includes('book')) {
    go('/faithhub/provider/resources-manager');
    return;
  }

  if (label.includes('event')) {
    go('/faithhub/provider/events-manager');
    return;
  }

  if (label.includes('beacon') || label.includes('campaign')) {
    go('/faithhub/provider/beacon-dashboard');
    return;
  }

  if (label.includes('audience') || label.includes('notification') || label.includes('reminder')) {
    go('/faithhub/provider/audience-notifications');
    return;
  }

  if (label.includes('wallet') || label.includes('payout')) {
    go('/faithhub/provider/wallet-payouts');
    return;
  }

  if (label.includes('team') || label.includes('leadership') || label.includes('role') || label.includes('permission')) {
    go('/faithhub/provider/roles-permissions');
    return;
  }

  if (label.includes('follow') || label.includes('story')) {
    go('/faithhub/provider/community-groups');
    return;
  }

  go('/faithhub/provider/dashboard');
}

