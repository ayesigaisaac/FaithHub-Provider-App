import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, children, className = '' }: CardProps) {
  return (
    <section className={`ds-card p-5 ${className}`.trim()}>
      {(title || subtitle) && (
        <header className="mb-4">
          {title ? <h3 className="text-base font-semibold text-faith-ink">{title}</h3> : null}
          {subtitle ? <p className="mt-1 ds-subtitle">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}
