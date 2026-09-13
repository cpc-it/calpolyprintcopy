import { LANDING_PAGE, withOrderUtm } from 'constants/landingPageSeo';

import Image from 'next/image';

import styles from './HomepageAnswers.module.scss';

const orderCtaHref = withOrderUtm(LANDING_PAGE.orderUrl, 'resource_panel_button');

const RESOURCE_ITEMS = [
  'Product options and specifications',
  'File setup guidelines',
  'Paper and finish selectors',
  'Templates and resources',
  'Easy online ordering',
];

const SUPPORT_CARDS = [
  {
    title: 'Reliable',
    image: '/static/cal-poly-print-copy-resume-printing.jpg',
    copy: 'Quality printing, dependable turnaround and support when you need it. Located right on campus and designed for the Cal Poly community.',
  },
  {
    title: 'Student-Friendly',
    image: '/static/cal-poly-students-walking-on-campus.jpg',
    copy: 'From class presentations and research posters to club promotions and campus events, we understand student needs and campus deadlines.',
  },
  {
    title: 'Every Order Gives Back',
    image: '/static/cal-poly-students-campus-welcome-event.jpg',
    copy: 'Every purchase helps support the university community.  Print & Copy helps create student jobs and fund programs, services and opportunities that enhance the Mustang experience.',
  },
];

export default function HomepageAnswers() {
  return (
    <section className={styles.answers} aria-label="Print and support information">
      <section className={styles.resourceBand}>
        <div>
          <div className={styles.resourcePanel}>
            <div className={styles.resourceMedia}>
              <Image
                src="/static/cal-poly-print-copy-online-ordering.jpg"
                width={640}
                height={420}
                alt="Hands typing on a laptop keyboard to submit an online print order."
                className={styles.resourceImage}
              />
            </div>

            <div className={styles.resourceContent}>
              <h2>
                <span>Everything You Need,</span>
                <span className={styles.gold}>All in One Place</span>
              </h2>
              <p>The Print Portal includes:</p>
              <ul>
                {RESOURCE_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <a
                href={orderCtaHref}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.portalLink}
              >
                Order Printing
              </a>
            </div>
          </div>
        </div>
      </section>


      <section className={styles.supportSection} aria-labelledby="support-heading">
        <div>
          <h2 id="support-heading" className={styles.supportHeading}>
            Printing That Supports Cal Poly
          </h2>
          <div className={styles.supportCards}>
            {SUPPORT_CARDS.map((card) => (
              <article key={card.title} className={styles.supportCard}>
                <Image
                  src={card.image}
                  width={360}
                  height={220}
                  alt={`${card.title} placeholder image`}
                  className={styles.supportImage}
                />
                <div className={styles.supportBody}>
                  <h3>{card.title}</h3>
                  <p>{card.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.goSection} aria-labelledby="go-heading">
        <div className={styles.goInner}>
          <h2 id="go-heading" className={styles.goHeading}>
            Need to print on the go?
          </h2>
          <p className={styles.goDescription}>
            Mustang Prints makes self-service printing easy. Print, copy or scan at
            convenient kiosk locations across campus. Send your files ahead of time
            or walk up and print directly at the kiosk.
          </p>

          <a
            href="/mustang-prints"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.goButton}
          >
            Find a Mustang Prints kiosk
          </a>
        </div>
      </section>

      <section className={styles.helpSection} aria-labelledby="help-heading">
        <div className={styles.helpGrid}>
          <div className={styles.helpMedia}>
            <Image
              src="/static/cal-poly-robert-e-kennedy-library.jpg"
              width={980}
              height={540}
              alt="Robert E. Kennedy Library at Cal Poly"
              className={styles.helpImage}
            />
          </div>

          <div className={styles.helpContent}>
            <div className={styles.helpInner}>
              <h2 id="help-heading">
                Need <span className={styles.gold}>Help?</span>
              </h2>
              <p className={styles.bigger}>
                Not sure what to order? Have questions about file setup or sizing? We&rsquo;re happy to help.
              </p>
              <p>
                Email: <a href={`mailto:${LANDING_PAGE.email}`}>{LANDING_PAGE.email}</a>
              </p>
              <p>Phone: <a href="tel:8057562399">805-756-2399</a></p>
              <p>Location: Building 35, Room 112</p>
              <p>Hours: Monday - Thursday, 8 a.m. - 5 p.m. <br/> Friday, 8 a.m. - 4 p.m. <br/> Closed Sat & Sun</p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}