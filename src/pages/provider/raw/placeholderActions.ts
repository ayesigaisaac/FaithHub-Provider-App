import type { MouseEvent } from 'react';
import {
  getButtonAction,
  isButtonActionId,
  resolveActionFromLabel,
  type ButtonActionId,
} from '@/navigation/buttonActions';

const TOAST_ID = 'faithhub-placeholder-toast';

function normalizeLabel(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function go(path: string): void {
  try {
    if (window.location.pathname === path) return;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  } catch {
    window.location.assign(path);
  }
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

async function executeAction(actionId: ButtonActionId, event: MouseEvent<HTMLButtonElement>): Promise<void> {
  const action = getButtonAction(actionId);

  if (action.kind === 'preview_mode' && action.previewMode) {
    setPreviewMode(action.previewMode);
    return;
  }

  if (action.kind === 'copy_link') {
    try {
      await copyCurrentLink();
      showToast('Link copied');
    } catch {
      showToast('Unable to copy link');
    }
    return;
  }

  if (action.kind === 'navigate' && action.targetPath) {
    const explicitTarget = event.currentTarget.dataset.targetPath;
    go(explicitTarget || action.targetPath);
    return;
  }

  go('/faithhub/provider/dashboard');
}

function resolveActionId(explicitActionId: ButtonActionId | undefined, event: MouseEvent<HTMLButtonElement>): ButtonActionId {
  if (explicitActionId) {
    return explicitActionId;
  }

  const dataAction = event.currentTarget.dataset.action;
  if (dataAction && isButtonActionId(dataAction)) {
    return dataAction;
  }

  const label = normalizeLabel(event.currentTarget.textContent ?? '');
  const resolved = resolveActionFromLabel(label);
  return resolved ?? 'open_provider_dashboard';
}

async function runPlaceholderAction(
  explicitActionId: ButtonActionId | undefined,
  event: MouseEvent<HTMLButtonElement>,
): Promise<void> {
  const actionId = resolveActionId(explicitActionId, event);
  await executeAction(actionId, event);
}

export function handleRawPlaceholderAction(
  actionId: ButtonActionId,
): (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
export function handleRawPlaceholderAction(
  event: MouseEvent<HTMLButtonElement>,
): Promise<void>;
export function handleRawPlaceholderAction(
  actionOrEvent: ButtonActionId | MouseEvent<HTMLButtonElement>,
): Promise<void> | ((event: MouseEvent<HTMLButtonElement>) => Promise<void>) {
  if (typeof actionOrEvent === 'string') {
    return (event: MouseEvent<HTMLButtonElement>) => runPlaceholderAction(actionOrEvent, event);
  }

  return runPlaceholderAction(undefined, actionOrEvent);
}
