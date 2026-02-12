import React from 'react';

function Modal({ open, title, children, actions, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <section className="modal-panel" onClick={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h3>{title}</h3>
          {onClose ? (
            <button className="btn" type="button" onClick={onClose}>
              Cerrar
            </button>
          ) : null}
        </header>
        <div className="modal-body">{children}</div>
        {actions ? <div className="actions-row modal-actions">{actions}</div> : null}
      </section>
    </div>
  );
}

export default Modal;

