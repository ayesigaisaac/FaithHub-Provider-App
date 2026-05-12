import type { ReactNode } from "react";

type IconSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function IconSurface({ children, className = "" }: IconSurfaceProps) {
  return <span className={`ds-icon ${className}`.trim()}>{children}</span>;
}

