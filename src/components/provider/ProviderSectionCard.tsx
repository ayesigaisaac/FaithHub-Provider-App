import type { ReactNode } from "react";
import { ProviderSurfaceCard } from "./ProviderSurfaceCard";

type ProviderSectionCardProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  titleTag?: "h2" | "h3";
};

export function ProviderSectionCard({
  title,
  subtitle,
  right,
  children,
  className,
  bodyClassName,
  titleTag = "h2",
}: ProviderSectionCardProps) {
  const TitleTag = titleTag;

  return (
    <ProviderSurfaceCard
      title={<TitleTag className="text-[15px] font-bold tracking-tight text-faith-ink sm:text-base">{title}</TitleTag>}
      subtitle={subtitle ? <p className="text-[12px] leading-5 text-faith-slate sm:text-[13px]">{subtitle}</p> : undefined}
      right={right}
      className={className ?? "rounded-2xl p-4 shadow-soft sm:p-5 lg:p-6"}
      headerClassName="flex items-start justify-between gap-3"
      rightClassName="w-full sm:w-auto sm:shrink-0"
      bodyClassName={bodyClassName ?? "mt-4 sm:mt-5"}
    >
      {children}
    </ProviderSurfaceCard>
  );
}
