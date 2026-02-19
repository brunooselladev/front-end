import React from 'react';

const resolveRowKey = (row, index) => {
  if (row?.id !== undefined && row?.id !== null) return row.id;
  if (row?._id !== undefined && row?._id !== null) return row._id;
  return `row-${index}`;
};

function renderValue(column, row) {
  if (typeof column.render === 'function') {
    return column.render(row[column.key], row);
  }
  const value = row[column.key];
  if (value === null || value === undefined || value === '') return '-';
  return value;
}

// Icon components
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const ACTION_ICON_MAP = {
  ver: { icon: <EyeIcon />, color: '#17a2b8' },
  editar: { icon: <EditIcon />, color: '#28a745' },
  eliminar: { icon: <TrashIcon />, color: '#dc3545' },
};

function resolveActionIcon(label = '') {
  const key = label.toLowerCase();
  return ACTION_ICON_MAP[key] || null;
}

const styles = `
  .entity-table-wrapper {
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #333;
  }

  .entity-table-wrapper .entity-table__empty {
    text-align: center;
    padding: 48px;
    color: #888;
  }

  .entity-table-wrapper table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
  }

  .entity-table-wrapper thead tr {
    border-bottom: 1px solid #e5e7eb;
  }

  .entity-table-wrapper thead th {
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 12px 16px;
  }

  .entity-table-wrapper tbody tr {
    border-bottom: 1px solid #e5e7eb;
    transition: background 0.15s;
  }

  .entity-table-wrapper tbody tr:hover {
    background: #f9fafb;
  }

  .entity-table-wrapper tbody td {
    padding: 16px;
    font-size: 14px;
    color: #374151;
  }

  .entity-table-wrapper .actions-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .entity-table-wrapper .icon-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: opacity 0.15s;
  }

  .entity-table-wrapper .icon-btn:hover {
    opacity: 0.7;
  }

  /* Mobile card styles */
  .entity-table__mobile {
    display: none;
  }

  @media (max-width: 640px) {
    .entity-table__desktop {
      display: none;
    }
    .entity-table__mobile {
      display: block;
    }
    .entity-table__card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .entity-table__card-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
      border-bottom: 1px solid #f3f4f6;
    }
    .entity-table__card-row:last-child {
      border-bottom: none;
    }
    .entity-table__card-label {
      font-weight: 600;
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
    }
    .entity-table__card-value {
      color: #374151;
    }
    .entity-table__card-actions {
      display: flex;
      gap: 12px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
    }
  }
`;

function EntityTable({ columns, rows, actions = [] }) {
  return (
    <>
      <style>{styles}</style>
      <div className="entity-table-wrapper">
        {!rows.length ? (
          <div className="entity-table__empty">
            <h3>No hay resultados</h3>
            <p>No hay datos para mostrar.</p>
          </div>
        ) : (
          <div>
            {/* Desktop */}
            <div className="entity-table__desktop">
              <table>
                <thead>
                  <tr>
                    {columns.map((col) => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                    {actions.length ? <th>Acciones</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIndex) => {
                    const rowKey = resolveRowKey(row, rowIndex);
                    return (
                      <tr key={rowKey}>
                        {columns.map((col) => (
                          <td key={`${rowKey}-${col.key}`}>{renderValue(col, row)}</td>
                        ))}
                        {actions.length ? (
                          <td>
                            <div className="actions-row">
                              {actions.map((action) => {
                                const iconInfo = resolveActionIcon(action.label);
                                return (
                                  <button
                                    key={`${action.label}-${rowKey}`}
                                    className="icon-btn"
                                    style={{ color: iconInfo?.color || '#6b7280' }}
                                    onClick={() => action.onClick(row)}
                                    type="button"
                                    title={action.label}
                                  >
                                    {iconInfo ? iconInfo.icon : action.label}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        ) : null}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="entity-table__mobile">
              {rows.map((row, rowIndex) => {
                const rowKey = resolveRowKey(row, rowIndex);
                return (
                  <article className="entity-table__card" key={`mobile-${rowKey}`}>
                    <div className="entity-table__card-grid">
                      {columns.map((col) => (
                        <div className="entity-table__card-row" key={`mobile-${rowKey}-${col.key}`}>
                          <span className="entity-table__card-label">{col.label}</span>
                          <span className="entity-table__card-value">{renderValue(col, row)}</span>
                        </div>
                      ))}
                    </div>
                    {actions.length ? (
                      <div className="entity-table__card-actions">
                        {actions.map((action) => {
                          const iconInfo = resolveActionIcon(action.label);
                          return (
                            <button
                              key={`${action.label}-${rowKey}`}
                              className="icon-btn"
                              style={{ color: iconInfo?.color || '#6b7280' }}
                              onClick={() => action.onClick(row)}
                              type="button"
                              title={action.label}
                            >
                              {iconInfo ? iconInfo.icon : action.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default EntityTable;