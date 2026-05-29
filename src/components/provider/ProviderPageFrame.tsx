import type { ReactNode } from "react";

type ProviderPageFrameProps = {
  children: ReactNode;
  className?: string;
  maxWidthClassName?: string;
};

const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(" ");

export function ProviderPageFrame({ children, className, maxWidthClassName }: ProviderPageFrameProps) {
  return (
    <div className={cx("fh-page-frame", maxWidthClassName, className)}>
      {children}
    </div>
  );
}

