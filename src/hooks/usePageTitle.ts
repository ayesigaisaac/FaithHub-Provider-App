import { useEffect } from 'react';

export function usePageTitle(title?: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} • FaithHub Provider App` : 'FaithHub Provider App';
    return () => {
      document.title = prev;
    };
  }, [title]);
}
