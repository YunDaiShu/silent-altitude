import { useEffect, useRef, useState } from 'react';
import site from '../site.config';
import useScrollProgress from '../hooks/useScrollProgress';

export default function Hero() {
  const trackRef = useRef(null);
  const videoRef = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);

  // Drives --hero-progress (0 → 1) on .hero; CSS turns it into transform/opacity.
  useScrollProgress(trackRef, { varName: '--hero-progress' });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const attempt = video.play();
    // A missing placeholder file rejects play(); swallow it so the console stays clean.
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  }, [videoFailed]);

  const { heroTitle, nameCn, roleCn, assets } = site;

  return (
    <section className="hero" ref={trackRef} aria-label="Hero">
      <div className="hero__stage">
        <div className="hero__media" data-video={videoFailed ? 'fallback' : 'video'}>
          {/* Always mounted: it is the whole picture when the video is absent. */}
          <div className="hero__fallback" aria-hidden="true" />

          {!videoFailed && (
            <video
              ref={videoRef}
              className="hero__video"
              poster={assets.heroPoster}
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
              onError={() => setVideoFailed(true)}
            >
              {/* WebM first (smaller), MP4 for Safari; the element only errors once every source failed. */}
              {assets.heroVideo && <source src={assets.heroVideo} type="video/webm" />}
              {assets.heroVideoFallback && <source src={assets.heroVideoFallback} type="video/mp4" />}
            </video>
          )}

          <div className="hero__shade" aria-hidden="true" />
          <div className="hero__grain" aria-hidden="true" />
        </div>

        <div className="hero__content">
          <p className="eyebrow hero__eyebrow">
            <span className="eyebrow__line" aria-hidden="true" />
            Portfolio · MMXXVI
          </p>
          <h1 className="hero__title">{heroTitle}</h1>
          <p className="hero__meta">
            <span className="hero__meta-han">{nameCn}</span>
            <span className="hero__meta-dot" aria-hidden="true" />
            <span className="hero__meta-han">{roleCn}</span>
          </p>
        </div>

        <div className="hero__cue" aria-hidden="true">
          <span>Scroll</span>
          <span className="hero__cue-line" />
        </div>
      </div>
    </section>
  );
}
