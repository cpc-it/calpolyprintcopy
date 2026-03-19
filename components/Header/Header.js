// Header.jsx
import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import { FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { NavigationMenu, SkipNavigationLink } from '../';

import MobileNav from './MobileNav';
import styles from './Header.module.scss';
let cx = classNames.bind(styles);

function useIsMobile(bp = 767) {
  const [isMobile, set] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${bp}px)`);
    const onChange = () => set(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, [bp]);
  return isMobile;
}

export default function Header({ className, menuItems }) {
  const router = useRouter();
  const [isNavShown, setIsNavShown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile(767);
  const menuRef = useRef(null);

  const headerClasses = cx('header', className, { scrolled: isScrolled });
  const headerContentClasses = cx('container', 'header-content', { scrolled: isScrolled });
  const navClasses = cx('primary-navigation', isNavShown ? cx('show') : undefined);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsNavShown(false);
  }, [router.asPath]);

  useEffect(() => {
    if (!isMobile) {
      setIsNavShown(false);
      document.body.style.removeProperty('overflow');
      return undefined;
    }

    if (isNavShown) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.removeProperty('overflow');
    }

    return () => {
      document.body.style.removeProperty('overflow');
    };
  }, [isMobile, isNavShown]);

  return (
    <header className={headerClasses}>
      <SkipNavigationLink />

      <div className={headerContentClasses}>
        <div className={cx('bar')}>
          <div className={cx('logo')}>
            <Link href="/" title="Home">
              <Image
                src="/logo.png"
                width={400}
                height={80}
                alt="Cal Poly University logo"
                layout="responsive"
              />
            </Link>
          </div>
          

          <button
            type="button"
            className={cx('nav-toggle', { open: isNavShown })}
            onClick={() => setIsNavShown(!isNavShown)}
            aria-label={isNavShown ? 'Close navigation' : 'Open navigation'}
            aria-expanded={isNavShown}
            aria-controls="mobile-navigation"
          >
            {isNavShown ? <FaTimes /> : <FaBars />}
          </button>

          {isMobile ? (
            <MobileNav
              isOpen={isNavShown}
              className={cx('mobile-nav-shell')}
              menuItems={menuItems}
              onNavigate={() => setIsNavShown(false)}
              onClose={() => setIsNavShown(false)}
            >
              <li className={cx('mobile-item', 'mobile-utility-item')}>
                <Link
                  href="/search"
                  title="Search"
                  className={cx('mobile-link', 'mobile-utility-link')}
                  onClick={() => setIsNavShown(false)}
                >
                  <FaSearch title="Search" role="img" />
                  <span>Search</span>
                </Link>
              </li>
            </MobileNav>
          ) : (
            <NavigationMenu
              id={cx('primary-navigation')}
              className={navClasses}
              menuItems={menuItems}
              ref={menuRef}
            >
              <li>
                <Link href="/search" title="Search" className={cx('desktop-search-link')}>
                  <FaSearch title="Search" role="img" />
                </Link>
              </li>
            </NavigationMenu>
          )}
        </div>
      </div>
    </header>
  );
}
