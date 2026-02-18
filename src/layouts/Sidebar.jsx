import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { menuService } from '../services';
import { useAuthStore } from '../store/authStore';

const isPathActive = (currentPath, targetPath) => {
  if (!targetPath) return false;
  if (currentPath === targetPath) return true;
  return currentPath.startsWith(`${targetPath}/`);
};

const hasActiveSubsection = (item, pathname) =>
  (item.subsections || []).some((subsection) => isPathActive(pathname, subsection.url));

function Sidebar() {
  const role = useAuthStore((state) => state.getRole());
  const items = useMemo(() => menuService.getMenuItems(role), [role]);
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});

  useEffect(() => {
    setExpandedItems((previous) => {
      const next = { ...previous };
      items.forEach((item) => {
        if (item.subsections?.length && hasActiveSubsection(item, location.pathname)) {
          next[item.label] = true;
        }
      });
      return next;
    });
  }, [items, location.pathname]);

  const toggleSubsections = (itemLabel) => {
    setExpandedItems((previous) => ({
      ...previous,
      [itemLabel]: !previous[itemLabel],
    }));
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar__nav">
        <ul>
          {items.map((item) => {
            const expanded = Boolean(expandedItems[item.label]);
            const parentSelected = hasActiveSubsection(item, location.pathname);

            return (
              <li className="sidebar__item" key={item.label}>
                {!item.subsections?.length ? (
                  <NavLink
                    to={item.url}
                    className={({ isActive }) => `sidebar__link${isActive ? ' selected' : ''}`}
                  >
                    <span className="sidebar__icon">
                      <img src={item.icon} alt={item.label} />
                    </span>
                    <span className="sidebar__label">{item.label}</span>
                  </NavLink>
                ) : (
                  <>
                    <div className="sidebar__main-item has-subsections">
                      <button
                        className={`sidebar__link sidebar__link--parent${parentSelected ? ' selected' : ''}`}
                        type="button"
                        onClick={() => toggleSubsections(item.label)}
                      >
                        <span className="sidebar__icon">
                          <img src={item.icon} alt={item.label} />
                        </span>
                        <span className="sidebar__label">{item.label}</span>
                        <span className={`sidebar__arrow${expanded ? ' rotated' : ''}`}>�</span>
                      </button>
                    </div>
                    <ul className={`sidebar__subsections${expanded ? ' expanded' : ''}`}>
                      {item.subsections.map((subsection) => (
                        <li className="sidebar__subsection" key={subsection.url}>
                          <NavLink
                            to={subsection.url}
                            className={({ isActive }) =>
                              `sidebar__link sidebar__link--child${isActive ? ' selected' : ''}`
                            }
                          >
                            <span className="sidebar__label">{subsection.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
