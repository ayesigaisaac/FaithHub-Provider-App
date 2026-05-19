import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, children, className = '' }: CardProps) {
  return (
    <section className={`ds-card p-4 sm:p-5 ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="mb-4 sm:mb-5">
          {title ? <h3 className="text-[15px] sm:text-base font-semibold text-faith-ink">{title}</h3> : null}
          {subtitle ? <p className="mt-1.5 ds-subtitle leading-6">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}
