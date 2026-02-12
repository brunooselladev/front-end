import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { menuService } from '../services';
import { useAuthStore } from '../store/authStore';
import logoImage from '../assets/logo.png';
import logoutIcon from '../assets/logout.svg';
import hamburgerIcon from '../assets/hamburger.svg';

const roleDisplay = {
  admin: 'Administrador',
  agente: 'Agente comunitario',
  efector: 'Efector de salud',
  referente: 'Referente afectivo',
  usmya: 'USMYA',
};

const isPathActive = (currentPath, targetPath) => {
  if (!targetPath) return false;
  if (currentPath === targetPath) return true;
  return currentPath.startsWith(`${targetPath}/`);
};

const hasActiveSubsection = (item, pathname) =>
  (item.subsections || []).some((subsection) => isPathActive(pathname, subsection.url));

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useAuthStore((state) => state.user);
  const role = useAuthStore((state) => state.getRole());
  const logout = useAuthStore((state) => state.logout);

  const items = useMemo(() => menuService.getMenuItems(role), [role]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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

  useEffect(() => {
    if (!showMobileMenu) return undefined;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  useEffect(() => {
    setShowMobileMenu(false);
    document.body.style.overflow = '';
  }, [location.pathname]);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSubsections = (itemLabel) => {
    setExpandedItems((previous) => ({
      ...previous,
      [itemLabel]: !previous[itemLabel],
    }));
  };

  const selectItem = (url) => {
    navigate(url);
    setShowMobileMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <img src={logoImage} alt="Logo" className="navbar__logo" />
        <span className="navbar__app-name">MappA</span>
      </div>

      <div className="navbar__user-info">
        <span className="navbar__user-name">{user?.email || 'usuario@demo.com'}</span>
        <span className="navbar__user-role">{roleDisplay[role] || role || 'Invitado'}</span>
      </div>

      <div className="navbar__right">
        <button className="navbar__logout" type="button" onClick={onLogout} title="Cerrar sesion">
          <img src={logoutIcon} alt="Logout" />
        </button>

        <button
          className="navbar__hamburger"
          type="button"
          onClick={() => setShowMobileMenu((value) => !value)}
          title="Menu"
        >
          <img src={hamburgerIcon} alt="Menu" />
        </button>

        {showMobileMenu ? (
          <div className="navbar__mobile-menu">
            <nav className="mobile-menu__nav">
              <ul>
                {items.map((item) => {
                  const expanded = Boolean(expandedItems[item.label]);
                  const selected = hasActiveSubsection(item, location.pathname);

                  return (
                    <li className="mobile-menu__item" key={item.label}>
                      {!item.subsections?.length ? (
                        <button
                          className={`mobile-menu__link${isPathActive(location.pathname, item.url) ? ' selected' : ''}`}
                          type="button"
                          onClick={() => selectItem(item.url)}
                        >
                          <span className="mobile-menu__icon">
                            <img src={item.icon} alt={item.label} />
                          </span>
                          <span className="mobile-menu__label">{item.label}</span>
                        </button>
                      ) : (
                        <div className="mobile-menu__parent-item">
                          <button
                            className={`mobile-menu__link mobile-menu__link--parent${selected ? ' selected' : ''}${
                              expanded ? ' expanded' : ''
                            }`}
                            type="button"
                            onClick={() => toggleSubsections(item.label)}
                          >
                            <span className="mobile-menu__icon">
                              <img src={item.icon} alt={item.label} />
                            </span>
                            <span className="mobile-menu__label">{item.label}</span>
                            <span className={`mobile-menu__arrow${expanded ? ' rotated' : ''}`}>{'>'}</span>
                          </button>

                          {expanded ? (
                            <ul className="mobile-menu__subsections">
                              {item.subsections.map((subsection) => (
                                <li className="mobile-menu__subsection" key={subsection.url}>
                                  <button
                                    className={`mobile-menu__link mobile-menu__link--child${
                                      isPathActive(location.pathname, subsection.url) ? ' selected' : ''
                                    }`}
                                    type="button"
                                    onClick={() => selectItem(subsection.url)}
                                  >
                                    <span className="mobile-menu__label">{subsection.label}</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mobile-menu__footer">
              <button className="mobile-menu__logout-btn" type="button" onClick={onLogout}>
                <span className="mobile-menu__logout-icon">
                  <img src={logoutIcon} alt="Logout" />
                </span>
                <span className="mobile-menu__logout-label">Cerrar sesion</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
