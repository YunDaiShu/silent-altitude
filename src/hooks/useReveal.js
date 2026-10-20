import { useEffect } from 'react';

/**
 * IntersectionObserver reveal for every [data-reveal] node under rootRef.
 * Adds .is-visible once; with prefers-reduced-motion the nodes are revealed
 * immediately and the CSS keeps only the fade (no translate).
 */
export default function useReveal(rootRef, options = {}) {
  const { selector = '[data-reveal]', threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = options;

  useEffect(() => {
    const root = rootRef?.current;
    if (!root) return undefined;

    const nodes = Array.from(root.querySelectorAll(selector));
    if (!nodes.length) return undefined;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || typeof IntersectionObserver === 'undefined') {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold, rootMargin },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [rootRef, selector, threshold, rootMargin]);
}
