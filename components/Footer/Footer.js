import { LANDING_PAGE, withOrderUtm } from 'constants/landingPageSeo';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

import styles from './Footer.module.scss';

const orderHref = withOrderUtm(LANDING_PAGE.orderUrl, 'footer_order_link');

const PRIMARY_LINKS = [
  { label: 'University Home', href: 'https://www.calpoly.edu/' },
  { label: 'My Cal Poly Portal', href: 'https://myportal.calpoly.edu/' },
  { label: 'Campus Map', href: 'https://maps.calpoly.edu/' },
  { label: 'Campus Safety', href: 'https://afd.calpoly.edu/ehs/police/' },
];

const SECONDARY_LINKS = [
  { label: 'Privacy Notice', href: 'https://www.calpoly.edu/privacy-notice' },
  { label: 'Website Feedback', href: 'https://www.calpoly.edu/web-feedback' },
  { label: 'Web Accessibility Statement', href: 'https://www.calpoly.edu/web-accessibility' },
  { label: 'Title IX', href: 'https://titleix.calpoly.edu/' },
  {
    label: 'Campus Annual Security Report (PDF)',
    href: 'https://www.calpoly.edu/sites/default/files/2024-09/ASR2024.pdf',
  },
  { label: 'Campus Safety Plan (PDF)', href: 'https://afd.calpoly.edu/ehs/police/files/Campus-Safety-Plan.pdf' },
  { label: 'Students with Dependents', href: 'https://deanofstudents.calpoly.edu/students-with-dependents' },
];

export default function Footer({ siteTitle }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.mountains} aria-hidden="true" />
      <div className={styles.main}>
        <div className={`container ${styles.wrap}`}>
          <div className={styles.topMeta}>
            <div>
              <h3>Location</h3>
              <p>Building 35, Room 112</p>
              <p>
                <a href="https://maps.app.goo.gl/U7Gt1RDU8HKSxXhh9" target="_blank" rel="noopener noreferrer">
                  1 Grand Avenue, San Luis Obispo, CA 93407
                </a>
              </p>
            </div>

            <div>
              <h3>Hours</h3>
              <p>Monday - Thursday: 8am - 5pm</p>
              <p>Friday: 8am - 4pm</p>
              <p>Closed Sat & Sun</p>
            </div>

            <div>
              <h3>Order</h3>
              <a href={orderHref} target="_blank" rel="noopener noreferrer">
                Order Printing
              </a>
            </div>

            <div className={styles.contact}>
              <p className={styles.brandName}>{siteTitle ?? 'Cal Poly Print & Copy'}</p>
              <p>
                <a href={`mailto:${LANDING_PAGE.email}`}>{LANDING_PAGE.email}</a>
              </p>
              <p>
                <a href="tel:8057562399">805-756-2399</a>
              </p>
            </div>
          </div>

          <div className={styles.brandRow}>
            <Link href="/" title="Home" className={styles.logoLink} passHref>
              <Image
                src="/cal-poly-logo-reversed.png"
                width={218}
                height={58}
                alt="Cal Poly University logo"
              />
            </Link>
            <div className={styles.brandDetails}>
              <p className={styles.brandAddress}>1 Grand Avenue, San Luis Obispo, CA 93407</p>
              <a href="tel:8057561111" className={styles.mainPhone}>
                805-756-1111
              </a>
              <div className={styles.social}>
                <a href="https://www.instagram.com/calpoly/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://x.com/calpoly" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://www.facebook.com/calpoly" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebookF />
                </a>
              </div>
            </div>
          </div>

          <ul className={`${styles.utilityLinks} ${styles.utilityPrimary}`}>
            {PRIMARY_LINKS.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
              </li>
            ))}
          </ul>

          <ul className={`${styles.utilityLinks} ${styles.utilitySecondary}`}>
            {SECONDARY_LINKS.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">{item.label}</a>
              </li>
            ))}
          </ul>

          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} California Polytechnic State University
          </p>
        </div>
      </div>
    </footer>
  );
}
