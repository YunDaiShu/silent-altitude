import { useEffect, useRef } from 'react';

const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);

/**
 * Writes scroll progress into a CSS custom property (0 → 1) so sections can be
 * driven by pure transform/opacity, never by React re-renders.
 *
 * mode: 'element'  -> progress across targetRef's own scroll track
 *       'document' -> progress across the whole page (top progress bar)
 */
export default function useScrollProgress(targetRef, options = {}) {
  const { varName = '--scroll-progress', mode = 'element', onChange } = options;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (mode === 'element' && !targetRef?.current) return undefined;

    const rootEl = document.documentElement;
    let frame = 0;
    let queued = false;
    let previous = -1;

    const measure = () => {
      queued = false;
      let progress = 0;

      if (mode === 'document') {
        const distance = rootEl.scrollHeight - window.innerHeight;
        progress = distance > 0 ? clamp01(window.scrollY / distance) : 0;
        rootEl.style.setProperty(varName, progress.toFixed(4));
      } else {
        const node = targetRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const distance = rect.height - window.innerHeight;
        progress = distance > 0 ? clamp01(-rect.top / distance) : 0;
        node.style.setProperty(varName, progress.toFixed(4));
      }

      if (Math.abs(progress - previous) > 0.0002) {
        previous = progress;
        if (onChangeRef.current) onChangeRef.current(progress);
      }
    };

    // rAF throttle: many scroll events, at most one measurement per frame.
    const schedule = () => {
      if (queued) return;
      queued = true;
      frame = window.requestAnimationFrame(measure);
    };

    const resync = () => {
      previous = -1;
      schedule();
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', resync);
    window.addEventListener('orientationchange', resync);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', resync);
      window.removeEventListener('orientationchange', resync);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [targetRef, varName, mode]);
}
