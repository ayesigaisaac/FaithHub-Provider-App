import { getButtonAction, isButtonActionId, resolveActionFromLabel } from '@/navigation/buttonActions';

describe('buttonActions registry', () => {
  it('resolves common labels to deterministic actions', () => {
    expect(resolveActionFromLabel('Preview live page')).toBe('open_live_dashboard');
    expect(resolveActionFromLabel('View giving')).toBe('open_donations_funds');
    expect(resolveActionFromLabel('Share')).toBe('copy_current_link');
    expect(resolveActionFromLabel('Desktop')).toBe('set_preview_desktop');
    expect(resolveActionFromLabel('Mobile')).toBe('set_preview_mobile');
  });

  it('exposes valid known action ids', () => {
    expect(isButtonActionId('open_provider_dashboard')).toBe(true);
    expect(isButtonActionId('copy_current_link')).toBe(true);
    expect(isButtonActionId('not_real_action')).toBe(false);
  });

  it('returns known route paths for navigation actions', () => {
    expect(getButtonAction('open_live_dashboard').targetPath).toBe('/faithhub/provider/live-dashboard');
    expect(getButtonAction('open_donations_funds').targetPath).toBe('/faithhub/provider/donations-and-funds');
    expect(getButtonAction('open_wallet_payouts').targetPath).toBe('/faithhub/provider/wallet-payouts');
  });
});
