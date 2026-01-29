import { useEffect } from 'react';

const OBSERVER_OPTIONS = {
  root: null,
  rootMargin: '0px 0px -10% 0px',
  threshold: 0.2,
};

const markVisible = (elements) => {
  elements.forEach((element) => {
    element.classList.add('is-in-view');
  });
};

const detectMediaRight = (element) => {
  if (element.classList.contains('has-media-on-the-right')) return true;
  if (element.classList.contains('has-media-on-the-left')) return false;

  const children = Array.from(element.children);
  const mediaIndex = children.findIndex((child) =>
    child.classList.contains('wp-block-media-text__media')
  );
  const contentIndex = children.findIndex((child) =>
    child.classList.contains('wp-block-media-text__content')
  );

  if (mediaIndex === -1 || contentIndex === -1) return false;

  return mediaIndex > contentIndex;
};

export default function useMediaTextReveal(deps) {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const elements = Array.from(
      document.querySelectorAll('.wp-block-media-text')
    );

    if (!elements.length) return undefined;

    elements.forEach((element) => {
      element.classList.add('media-text-animate');
      if (detectMediaRight(element)) {
        element.classList.add('media-text-right');
      } else {
        element.classList.add('media-text-left');
      }
    });

    if (!('IntersectionObserver' in window)) {
      markVisible(elements);
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add('is-in-view');
        observer.unobserve(entry.target);
      });
    }, OBSERVER_OPTIONS);

    elements
      .filter((element) => !element.classList.contains('is-in-view'))
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, deps);
}
