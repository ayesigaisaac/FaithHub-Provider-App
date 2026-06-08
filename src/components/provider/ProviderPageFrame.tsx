import type { ReactNode } from 'react';
import { cx } from '@/components/cx';

type ProviderPageFrameProps = {
  children: ReactNode;
  className?: string;
  maxWidthClassName?: string;
};

export function ProviderPageFrame({ children, className, maxWidthClassName }: ProviderPageFrameProps) {
  return (
    <div className={cx('fh-page-frame fh-grid-start', maxWidthClassName, className)}>
      {children}
    </div>
  );
}
