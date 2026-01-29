import styles from './HomepageWelcome.module.scss';

export default function HomepageWelcome() {
  return (
    <div className={styles.homepageWelcome}>
      <div className={styles.panel}>
        <div className={styles.content}>
          <h2 className="intro">Welcome</h2>
          <p className="intro">Cal Poly Print & Copy is your print solutions center. Conveniently located in the Buidling 35, we specialize in small and large format prints for presentations, events, and the classroom. With easy online ordering and flexible hours, Cal Poly Print & Copy is the premier solution for all of your printing needs.</p>
        </div>
      </div>
    </div>
  );
}
