import React from 'react';

function PageShell({ title, subtitle, actions, children }) {
  return (
    <section className="page-shell">
      <header className="page-header">
        <div>
          <h1 className="page-header__title">{title}</h1>
          {subtitle ? <p className="page-meta">{subtitle}</p> : null}
        </div>
        {actions ? <div className="actions-row">{actions}</div> : null}
      </header>
      <div className="page-shell__content">{children}</div>
    </section>
  );
}

export default PageShell;
