import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PageShell from '../components/PageShell';
import { menuService } from '../services';
import { useAuthStore } from '../store/authStore';

const resolveLinks = (items) =>
  items.flatMap((item) => {
    if (item.subsections?.length) {
      return item.subsections.map((subsection) => ({
        label: `${item.label} - ${subsection.label}`,
        to: subsection.url,
        icon: subsection.icon || item.icon,
      }));
    }

    return [
      {
        label: item.label,
        to: item.url,
        icon: item.icon,
      },
    ];
  });

function HomePage() {
  const role = useAuthStore((state) => state.getRole());
  const items = menuService.getMenuItems(role);

  const links = useMemo(() => resolveLinks(items), [items]);

  return (
    <PageShell title="Inicio" subtitle="Modulos habilitados para tu perfil">
      <div className="grid grid-3 cards-container">
        {links.map((item) => (
          <article className="card" key={item.to}>
            <div className="card__icon-row">
              {item.icon ? <img className="card__icon" src={item.icon} alt={item.label} /> : null}
              <h3>{item.label}</h3>
            </div>
            <p className="page-meta">Ruta: {item.to}</p>
            <Link className="btn btn-primary btn-link" to={item.to}>
              Ir a modulo
            </Link>
          </article>
        ))}
      </div>
    </PageShell>
  );
}

export default HomePage;
