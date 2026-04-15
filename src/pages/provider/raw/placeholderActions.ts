import type { MouseEvent } from 'react';

const TOAST_ID = 'faithhub-placeholder-toast';

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

function showToast(message: string): void {
  const existing = document.getElementById(TOAST_ID);
  if (existing) {
    existing.remove();
  }

  const toast = document.createElement('div');
  toast.id = TOAST_ID;
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.left = '50%';
  toast.style.bottom = '24px';
  toast.style.transform = 'translateX(-50%)';
  toast.style.zIndex = '9999';
  toast.style.padding = '10px 14px';
  toast.style.borderRadius = '999px';
  toast.style.background = 'rgba(15, 23, 42, 0.92)';
  toast.style.color = '#fff';
  toast.style.fontSize = '12px';
  toast.style.fontWeight = '600';
  toast.style.boxShadow = '0 12px 28px rgba(15, 23, 42, 0.32)';
  toast.style.backdropFilter = 'blur(6px)';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 160ms ease';

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  window.setTimeout(() => {
    toast.style.opacity = '0';
    window.setTimeout(() => {
      toast.remove();
    }, 180);
  }, 1800);
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
    try {
      await copyCurrentLink();
      showToast('Link copied');
    } catch {
      showToast('Unable to copy link');
    }
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
