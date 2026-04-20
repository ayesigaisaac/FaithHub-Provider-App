import React, { useEffect, useRef } from 'react';

const FALLBACK_SRC = '/assets/media-fallback.svg';

function patchMedia(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll('img'));
  images.forEach((img) => {
    const applyFallback = () => {
      if (!img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = 'true';
        img.src = FALLBACK_SRC;
        img.alt = img.alt || 'Provider media placeholder';
        img.loading = 'lazy';
      }
    };

    if (img.complete && img.naturalWidth === 0) {
      applyFallback();
    }

    img.addEventListener('error', applyFallback, { once: true });
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
  });

  const videos = Array.from(root.querySelectorAll('video'));
  videos.forEach((video) => {
    const fail = () => {
      video.poster = FALLBACK_SRC;
      video.controls = true;
    };
    video.addEventListener('error', fail, { once: true });
  });
}

export function MediaFallbackContainer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    patchMedia(root);
    const observer = new MutationObserver(() => patchMedia(root));
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{children}</div>;
}
