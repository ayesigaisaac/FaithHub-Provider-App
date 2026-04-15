import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, subtitle, children, className = '' }: CardProps) {
  return (
    <section
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${className}`.trim()}
    >
      {(title || subtitle) && (
        <header className="mb-4">
          {title ? <h3 className="text-base font-semibold text-slate-900">{title}</h3> : null}
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </section>
  );
}
