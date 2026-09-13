import {
  LANDING_PAGE,
  withOrderUtm,
} from 'constants/landingPageSeo';

import { event as trackEvent } from 'lib/gtag';
import { Button } from 'components';

import styles from './HomepageOrderCta.module.scss';

const orderCtaHref = withOrderUtm(LANDING_PAGE.orderUrl, 'mid_page_portal_cta');

export default function HomepageOrderCta() {
  return (
    <section className={styles.orderCta} aria-labelledby="order-portal-heading">
      <div className={styles.mediaPanel} aria-hidden="true" />

      <div className={styles.contentPanel}>
        <div className={styles.contentInner}>
          <h2 id="order-portal-heading" className={styles.heading}>
            <span>Start Your</span> <span className={styles.highlight}>Order</span>
          </h2>
          <p className={styles.description}>
            Our online Print Portal is the fastest way to place an order,
            explore product options, and find everything you need to prepare
            your files.
          </p>

          <Button
            styleType="primary"
            href={orderCtaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.portalButton}
            onClick={() => {
              trackEvent('order_click', {
                event_category: 'conversion',
                event_label: 'mid_page_portal_cta',
                destination_url: LANDING_PAGE.orderUrl,
              });
            }}
          >
            Order Printing
          </Button>
        </div>
      </div>
    </section>
  );
}
