import { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import Hero from './sections/Hero';
import Quote from './sections/Quote';
import Works from './sections/Works';
import Emblem from './sections/Emblem';
import Signature from './sections/Signature';
import useReveal from './hooks/useReveal';
import useScrollProgress from './hooks/useScrollProgress';

/*
 * three.js is the bulk of the bundle and the badge block sits below the fold, so
 * the section is split into its own chunk. The import still starts on the first
 * render, but the first paint no longer waits for it.
 */
const LanyardSection = lazy(() => import('./sections/LanyardSection.jsx'));

/* Same box as .lanyard-frame, so the stand-in and the real stage agree. */
const STAGE_HEIGHT = 'clamp(520px, 62vh, 660px)';

/** Empty stand-in that reserves the block's box while the chunk loads. */
function LanyardFallback() {
  return (
    <section className="lanyard" aria-hidden="true">
      <div className="container lanyard__grid" style={{ minHeight: STAGE_HEIGHT }}>
        <div style={{ minHeight: STAGE_HEIGHT }} />
        <div className="lanyard__stage">
          <div className="lanyard-mount lanyard-frame" />
        </div>
      </div>
    </section>
  );
}

/** Reports the first commit of the lazy section back to App. */
function LanyardBoundary({ onMount }) {
  useEffect(() => {
    onMount();
  }, [onMount]);

  return <LanyardSection />;
}

/**
 * useReveal only collects the [data-reveal] nodes that exist when App mounts, and
 * this block arrives later. This second pass reveals the nodes the lazy section
 * brings with it, otherwise they would stay at opacity 0 forever.
 */
function useLateReveal(rootRef, ready) {
  useEffect(() => {
    if (!ready) return undefined;

    const root = rootRef.current;
    const nodes = root
      ? Array.from(root.querySelectorAll('section.lanyard [data-reveal]:not(.is-visible)'))
      : [];
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
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [rootRef, ready]);
}

function ScrollProgress() {
  useScrollProgress(null, { mode: 'document', varName: '--doc-progress' });

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span className="scroll-progress__bar" />
    </div>
  );
}

export default function App() {
  const mainRef = useRef(null);
  const [lanyardMounted, setLanyardMounted] = useState(false);
  const markLanyardMounted = useCallback(() => setLanyardMounted(true), []);

  useReveal(mainRef);
  useLateReveal(mainRef, lanyardMounted);

  return (
    <>
      <ScrollProgress />
      <main ref={mainRef}>
        <Hero />
        <Suspense fallback={<LanyardFallback />}>
          <LanyardBoundary onMount={markLanyardMounted} />
        </Suspense>
        <Quote />
        <Works />
        <Emblem />
        <Signature />
      </main>
      <div className="page-grain" aria-hidden="true" />
    </>
  );
}
