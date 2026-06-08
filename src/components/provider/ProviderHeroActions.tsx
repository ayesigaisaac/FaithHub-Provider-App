import type { ReactNode } from 'react';
import { cx } from '@/components/cx';

type ProviderHeroActionsProps = {
  children: ReactNode;
  className?: string;
};

export function ProviderHeroActions({ children, className }: ProviderHeroActionsProps) {
  return <div className={cx('flex flex-wrap items-center gap-2 xl:justify-end', className)}>{children}</div>;
}
