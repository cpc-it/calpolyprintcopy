import { useEffect, useState } from 'react';
import { Button } from 'components';
import { event as trackEvent } from 'lib/gtag';

import styles from './HomepageSurveyPopup.module.scss';

const SURVEY_URL =
  'https://www.surveymonkey.com/r/printandcopy';

export default function HomepageSurveyPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !isOpen) {
      document.body.style.removeProperty('overflow');
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closePopup();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.removeProperty('overflow');
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isReady]);

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleSurveyClick = () => {
    trackEvent('survey_popup_click', {
      event_category: 'engagement',
      event_label: 'homepage_survey_popup',
      destination_url: SURVEY_URL,
      link_text: 'Take Survey',
    });
  };

  if (!isReady || !isOpen) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={closePopup}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="homepage-survey-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={closePopup}
          aria-label="Close survey popup"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <div className={styles.imagePanel} aria-hidden="true">
          {/* <div className={`${styles.splat} ${styles.splatTop}`} /> */}
          {/* <div className={`${styles.splat} ${styles.splatBottom}`} /> */}
        </div>

        <div className={styles.contentPanel}>
          <h2 id="homepage-survey-title" className={styles.title}>
            Spill The Ink
          </h2>
          <p className={styles.eyebrow}>We want your feedback.</p>
          <p className={styles.copy}>
            Take 10 minutes. Share your thoughts.
            <br />
            Get a chance to win $25.
          </p>
          <Button
            href={SURVEY_URL}
            className={styles.cta}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSurveyClick}
          >
            Take Survey
          </Button>
        </div>
      </div>
    </div>
  );
}
