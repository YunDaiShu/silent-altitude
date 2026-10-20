import { useEffect, useState } from 'react';
import Lanyard from '../components/lanyard/Lanyard';
import site from '../site.config';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * The vendored Lanyard always adds its own `lanyard` class to the host div, which
 * collides with the section's `.lanyard` rule. Inline geometry keeps the canvas
 * host pinned to the mount whatever the stylesheet order ends up being.
 */
const HOST_STYLE = {
  position: 'absolute',
  inset: 0,
  width: 'auto',
  height: 'auto',
  padding: 0,
  borderTop: 'none',
  background: 'none',
};

/** Live prefers-reduced-motion flag: no idle sway, no intro, dragging stays. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;

    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = (event) => setReduced(event.matches);

    setReduced(query.matches);
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', sync);
      return () => query.removeEventListener('change', sync);
    }
    query.addListener(sync);
    return () => query.removeListener(sync);
  }, []);

  return reduced;
}

/**
 * The vendored Lanyard builds its CanvasTextures from the card images at mount, so
 * a cold cache paints a bare slab for seconds. Warm the images first, then mount.
 */
function useTexturesReady(urls) {
  const [ready, setReady] = useState(false);
  const key = urls.filter(Boolean).join('|');

  useEffect(() => {
    let alive = true;
    const list = key ? key.split('|') : [];
    if (!list.length) {
      setReady(true);
      return undefined;
    }

    Promise.all(
      list.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            const settle = () => resolve();
            img.onload = settle;
            img.onerror = settle;
            // A stalled request must not keep the card unmounted forever.
            setTimeout(settle, 1200);
            img.src = url;
          }),
      ),
    ).then(() => {
      if (alive) setReady(true);
    });

    return () => {
      alive = false;
    };
  }, [key]);

  return ready;
}

export default function LanyardSection() {
  const { name, nameCn, role, roleCn, bio, posts, assets } = site;
  const reduced = useReducedMotion();
  const texturesReady = useTexturesReady([assets.lanyardFront, assets.lanyardBack, assets.lanyardStrap]);

  return (
    <section className="lanyard" aria-labelledby="blog-title">
      <div className="container lanyard__grid">
        <div className="blog" id="blog" data-reveal>
          <p className="eyebrow">Journal</p>
          <h2 className="blog__title" id="blog-title">
            {name}
            <span className="blog__title-cn">{nameCn}</span>
          </h2>
          <p className="blog__role">
            {role} <span className="blog__role-cn">{roleCn}</span>
          </p>
          <p className="blog__bio">{bio}</p>

          <ul className="blog__posts">
            {posts.map((post) => (
              <li className="post" key={post.title}>
                <span className="post__dot" aria-hidden="true" />
                <div className="post__body">
                  <p className="post__meta">
                    <span className="post__title">{post.title}</span>
                    <span className="post__date">{post.date}</span>
                  </p>
                  <p className="post__excerpt">{post.excerpt}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lanyard__stage" data-reveal>
          <div id="lanyard-mount" className="lanyard-mount lanyard-frame">
            {texturesReady && (
              <Lanyard
                frontImage={assets.lanyardFront}
                backImage={assets.lanyardBack}
                strapImage={assets.lanyardStrap}
                cardColor="#0b0b0d"
                strapColor="#0b0b0d"
                metal="gold"
                size={0.72}
                finish="glossy"
                interactive
                breeze={reduced ? 0 : 0.35}
                intro={!reduced}
                className="lanyard-canvas-host"
                style={HOST_STYLE}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
