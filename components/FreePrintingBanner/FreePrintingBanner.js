import { LANDING_PAGE } from 'constants/landingPageSeo';

import { useEffect, useRef, useState } from 'react';

import styles from './FreePrintingBanner.module.scss';

const STORAGE_KEY = 'print-copy-free-printing-2026-last-shown';
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
// The offer includes November 16 in the print shop's Pacific time zone.
const EXPIRES_AT = Date.parse('2026-11-17T00:00:00-08:00');

export default function FreePrintingBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const hasShown = useRef(false);

  useEffect(() => {
    const now = Date.now();
    if (now >= EXPIRES_AT) return undefined;

    if (!hasShown.current) {
      try {
        const lastShown = Number(window.localStorage.getItem(STORAGE_KEY));
        if (Number.isFinite(lastShown) && now - lastShown < COOLDOWN_MS) {
          return undefined;
        }

        window.localStorage.setItem(STORAGE_KEY, String(now));
      } catch (error) {
        // Do not repeatedly show a promotion if its cooldown cannot be saved.
        console.warn(
          'Free printing banner: unable to save display preference.',
          error
        );
        return undefined;
      }

      hasShown.current = true;
    }

    setIsVisible(true);

    const expiryTimer = window.setTimeout(
      () => setIsVisible(false),
      Math.min(EXPIRES_AT - now, 2147483647)
    );
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue !== null) {
        setIsVisible(false);
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.clearTimeout(expiryTimer);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const dismiss = () => {
    setIsVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch (error) {
      console.warn('Free printing banner: unable to save dismissal.', error);
    }
  };

  if (!isVisible) return null;

  return (
    <section className={styles.banner} aria-label="Free printing offer">
      <button
        type="button"
        className={styles.dismiss}
        aria-label="Dismiss free printing offer for 24 hours"
        onClick={dismiss}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="m6 6 12 12M6 18 18 6" />
        </svg>
      </button>
      <details className={styles.details} open>
        <summary className={styles.summary}>
          <span>Create an online account and get free printing.</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </summary>
        <div className={styles.content}>
          <span className={styles.deadline}>Now through Nov. 16</span>
          <p>
            Now through Nov. 16, get up to{' '}
            <strong>250 free black-and-white prints</strong> when you create a
            Print &amp; Copy online account.
          </p>
          <a
            className={styles.cta}
            href={LANDING_PAGE.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismiss}
          >
            Create an Account
            <span className={styles.srOnly}> (opens in a new tab)</span>
          </a>
        </div>
      </details>
    </section>
  );
}
