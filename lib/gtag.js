export const GA_MEASUREMENT_ID = 'G-VEQ5PH87TQ';

export function pageview(url) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: url,
    page_location: window.location.href,
    page_title: document.title,
    send_to: GA_MEASUREMENT_ID,
  });
}

export function event(action, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', action, {
    send_to: GA_MEASUREMENT_ID,
    ...params,
  });
}
