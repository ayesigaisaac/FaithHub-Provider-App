import type { CSSProperties, ImgHTMLAttributes } from 'react';

export type BrandLogoVariant = 'landscape' | 'portrait' | 'symbol';

const brandLogoByVariant: Record<BrandLogoVariant, string> = {
  landscape: '/assets/faithhub-logo-landscape.png',
  portrait: '/assets/faithhub-logo-portrait.png',
  symbol: '/assets/faithhub-logo-symbol.png',
};

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  alt?: string;
  className?: string;
  style?: CSSProperties;
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className' | 'style'>;

export function BrandLogo({
  variant = 'landscape',
  alt = 'FaithHub logo',
  className,
  style,
  ...imgProps
}: BrandLogoProps) {
  return (
    <img
      src={brandLogoByVariant[variant]}
      alt={alt}
      className={className}
      style={{ display: 'block', width: 'auto', height: 'auto', objectFit: 'contain', ...style }}
      loading="eager"
      decoding="async"
      {...imgProps}
    />
  );
}
