import { useEffect, useRef, useState } from 'react';
import { Button } from 'components';

import styles from './HomepageVideo.module.scss';

export default function HomepageVideo() {
  const controlsRef = useRef(null);
  const videoRef = useRef(null);
  const videoWrapRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isVideoInViewport, setIsVideoInViewport] = useState(false);
  const [controlsStyle, setControlsStyle] = useState({});

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncReducedMotionPreference = (event) => {
      const prefersReducedMotion = event.matches;
      setIsPaused(prefersReducedMotion);
      setIsHidden(prefersReducedMotion);
    };

    syncReducedMotionPreference(mediaQuery);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncReducedMotionPreference);

      return () => mediaQuery.removeEventListener('change', syncReducedMotionPreference);
    }

    mediaQuery.addListener(syncReducedMotionPreference);

    return () => mediaQuery.removeListener(syncReducedMotionPreference);
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) {
      return;
    }

    if (isHidden || isPaused) {
      videoElement.pause();
      return;
    }

    const playPromise = videoElement.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }, [isHidden, isPaused]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    let frameId = null;

    const updateControlsPosition = () => {
      const videoWrapElement = videoWrapRef.current;
      const controlsElement = controlsRef.current;

      if (!videoWrapElement || !controlsElement) {
        return;
      }

      const rect = videoWrapElement.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isMobile = window.innerWidth <= 767;
      const sideOffset = isMobile ? 16 : 32;
      const bottomOffset = isMobile ? 16 : 32;
      const controlsHeight = controlsElement.offsetHeight;

      if (rect.bottom <= 0 || rect.top >= viewportHeight) {
        setIsVideoInViewport(false);
        return;
      }

      const minBottom = bottomOffset;
      const maxBottom = viewportHeight - rect.top - controlsHeight - bottomOffset;

      if (maxBottom < minBottom) {
        setIsVideoInViewport(false);
        return;
      }

      const nextBottom = Math.min(
        Math.max(viewportHeight - rect.bottom + bottomOffset, minBottom),
        maxBottom
      );

      setControlsStyle({
        left: `${sideOffset}px`,
        right: isMobile ? `${sideOffset}px` : 'auto',
        bottom: `${nextBottom}px`,
      });
      setIsVideoInViewport(true);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateControlsPosition();
      });
    };

    updateControlsPosition();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const handlePauseToggle = () => {
    if (isHidden) {
      setIsHidden(false);
      setIsPaused(false);
      return;
    }

    setIsPaused((currentValue) => !currentValue);
  };

  const handleVisibilityToggle = () => {
    if (isHidden) {
      setIsHidden(false);
      setIsPaused(false);
      return;
    }

    setIsHidden(true);
    setIsPaused(true);
  };

  return (
    <div className="container">
      <div ref={videoWrapRef} className={styles.homepageVideoWrap}>
        {/* Background video */}
        <video
          ref={videoRef}
          className={styles.bgVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          hidden={isHidden}
        >
          <source src="/static/Print-and-Copy-BG.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div
          className={`${styles.gradientOverlay} ${isHidden ? styles.gradientOverlayStatic : ''}`}
        />

        {/* Foreground content */}
        <div className={styles.homepageVideo}>
          <div className={styles.homepageVideoHeadingOneWrap}>
            <h1 className={styles.homepageVideoHeadingOne}>
              Cal Poly Print &amp; Copy
            </h1>
            <p className={styles.homepageVideoHeadingOne}>
              {' '}
              is open for business in Building 35 Room 112
            </p>
          </div>

          <p>Hours of Operation</p>
          <p>Monday - Friday 9:00 am - 1:00 pm</p>
          <p>
            PLEASE BE AWARE ANY JOB TO BE BILLED TO A CPSU ACCOUNT WILL REQUIRE A
            PO NUMBER STARTING JULY 1, 2025
          </p>
          <p>Faculty and staff may place orders by clicking the button below.</p>
          <p>
            For all other inquiries, please email{' '}
            <a href="mailto:calpolyprints@calpoly.edu">calpolyprints@calpoly.edu</a>
          </p>

          <Button styleType="primary" href="/submit-print-online.">
            See How
          </Button>
        </div>

        <div
          ref={controlsRef}
          className={`${styles.motionControls} ${
            isVideoInViewport ? styles.motionControlsVisible : styles.motionControlsHidden
          }`}
          style={controlsStyle}
        >
          <button
            type="button"
            className={styles.motionControl}
            onClick={handlePauseToggle}
            aria-pressed={isPaused || isHidden}
          >
            {isPaused || isHidden ? 'Play background motion' : 'Pause background motion'}
          </button>
          <button
            type="button"
            className={styles.motionControl}
            onClick={handleVisibilityToggle}
            aria-pressed={isHidden}
          >
            {isHidden ? 'Show background video' : 'Hide background video'}
          </button>
        </div>
      </div>
    </div>
  );
}
