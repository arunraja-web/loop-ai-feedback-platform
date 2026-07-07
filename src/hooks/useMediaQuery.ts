'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true when the given CSS media query matches.
 * SSR-safe: always returns false on the server / during hydration.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    // Set initial state after mount (avoids SSR hydration mismatch)
    setMatches(mediaQueryList.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', handler);

    return () => {
      mediaQueryList.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}

// ---------------------------------------------------------------------------
// Tailwind breakpoint shortcuts
// ---------------------------------------------------------------------------

/** Below Tailwind's `sm` breakpoint (< 640px). */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 639px)');
}

/** At or above Tailwind's `sm` breakpoint (≥ 640px). */
export function useIsSm(): boolean {
  return useMediaQuery('(min-width: 640px)');
}

/** At or above Tailwind's `md` breakpoint (≥ 768px). */
export function useIsMd(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

/** At or above Tailwind's `lg` breakpoint (≥ 1024px). */
export function useIsLg(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}

/** At or above Tailwind's `xl` breakpoint (≥ 1280px). */
export function useIsXl(): boolean {
  return useMediaQuery('(min-width: 1280px)');
}
