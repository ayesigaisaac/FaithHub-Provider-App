export function navigateWithRouter(target: string): void {
  if (typeof window === 'undefined') return;
  const next = target?.trim();
  if (!next) return;

  // Keep full document navigation for non-http(s) and cross-origin targets.
  if (/^(mailto:|tel:|sms:)/i.test(next)) {
    window.location.assign(next);
    return;
  }

  try {
    const parsed = new URL(next, window.location.origin);
    if (parsed.origin !== window.location.origin) {
      window.location.assign(parsed.toString());
      return;
    }

    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    const destination = `${parsed.pathname}${parsed.search}${parsed.hash}`;
    if (current === destination) return;

    window.history.pushState({}, '', destination);
    window.dispatchEvent(new PopStateEvent('popstate'));
  } catch {
    window.location.assign(next);
  }
}
