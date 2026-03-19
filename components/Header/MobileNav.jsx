import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FaChevronDown, FaTimes } from 'react-icons/fa';
import classNames from 'classnames/bind';

import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function buildMenuTree(menuItems = []) {
  const map = {};
  const roots = [];

  menuItems.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  menuItems.forEach((item) => {
    if (item.parentId && map[item.parentId]) {
      map[item.parentId].children.push(map[item.id]);
      return;
    }

    roots.push(map[item.id]);
  });

  return roots;
}

function getLinkProps(item) {
  const target = item?.target === '_blank' ? '_blank' : undefined;
  const rel = target ? 'noopener noreferrer' : undefined;

  return {
    href: item?.path ?? '#',
    target,
    rel,
  };
}

export default function MobileNav({
  menuItems,
  className,
  children,
  isOpen,
  onNavigate,
  onClose,
}) {
  const [openIds, setOpenIds] = useState(() => new Set());
  const tree = useMemo(() => buildMenuTree(menuItems), [menuItems]);

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const closeAll = () => setOpenIds(new Set());

  const handleNavigate = () => {
    closeAll();
    onNavigate?.();
  };

  const renderItems = (items, depth = 0) =>
    items.map((item) => {
      const hasChildren = item.children?.length > 0;
      const open = openIds.has(item.id);

      return (
        <li
          key={item.id}
          className={cx('mobile-item', { open })}
          style={{ '--mobile-depth': depth }}
        >
          {hasChildren ? (
            <>
              <div className={cx('mobile-row')}>
                <Link
                  {...getLinkProps(item)}
                  className={cx('mobile-link', 'mobile-parent-link')}
                  onClick={handleNavigate}
                >
                  {item.label}
                </Link>
                <button
                  type="button"
                  className={cx('mobile-submenu-toggle')}
                  onClick={() => toggle(item.id)}
                  aria-expanded={open}
                  aria-controls={`mobile-submenu-${item.id}`}
                  aria-label={`${open ? 'Collapse' : 'Expand'} ${item.label}`}
                >
                  <FaChevronDown className={cx('mobile-submenu-icon')} />
                </button>
              </div>

              <ul
                id={`mobile-submenu-${item.id}`}
                className={cx('mobile-submenu')}
                hidden={!open}
              >
                {renderItems(item.children, depth + 1)}
              </ul>
            </>
          ) : (
            <Link
              {...getLinkProps(item)}
              className={cx('mobile-link')}
              onClick={handleNavigate}
            >
              {item.label}
            </Link>
          )}
        </li>
      );
    });

  return (
    <nav
      id="mobile-navigation"
      className={cx('mobile-nav', className, { open: isOpen })}
      aria-label="Mobile menu"
      hidden={!isOpen}
    >
      <button
        type="button"
        className={cx('mobile-backdrop')}
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className={cx('mobile-nav-inner')}>
        <div className={cx('mobile-nav-header')}>
          <button
            type="button"
            className={cx('mobile-close')}
            aria-label="Close menu"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>
        <ul className={cx('mobile-menu-list')}>
          {renderItems(tree)}
        </ul>
        <div className={cx('mobile-nav-footer')}>
          <ul className={cx('mobile-menu-list')}>{children}</ul>
        </div>
      </div>
    </nav>
  );
}
