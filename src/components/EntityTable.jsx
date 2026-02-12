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

function EntityTable({ columns, rows, actions = [] }) {
  if (!rows.length) {
    return (
      <div className="entity-table__empty">
        <h3>No hay resultados</h3>
        <p>No hay datos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="entity-table">
      <div className="entity-table__container">
        <div className="entity-table__desktop">
          <table className="entity-table__table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
                {actions.length ? <th>Acciones</th> : null}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => {
                const rowKey = resolveRowKey(row, rowIndex);
                return (
                  <tr key={rowKey}>
                    {columns.map((column) => (
                      <td key={`${rowKey}-${column.key}`}>{renderValue(column, row)}</td>
                    ))}
                    {actions.length ? (
                      <td>
                        <div className="actions-row">
                          {actions.map((action) => (
                            <button
                              key={`${action.label}-${rowKey}`}
                              className={`btn entity-table__action ${action.className || ''}`}
                              onClick={() => action.onClick(row)}
                              type="button"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="entity-table__mobile">
          {rows.map((row, rowIndex) => {
            const rowKey = resolveRowKey(row, rowIndex);
            return (
              <article className="entity-table__card" key={`mobile-${rowKey}`}>
                <div className="entity-table__card-grid">
                  {columns.map((column) => (
                    <div className="entity-table__card-row" key={`mobile-${rowKey}-${column.key}`}>
                      <span className="entity-table__card-label">{column.label}</span>
                      <span className="entity-table__card-value">{renderValue(column, row)}</span>
                    </div>
                  ))}
                </div>

                {actions.length ? (
                  <div className="entity-table__card-actions">
                    {actions.map((action) => (
                      <button
                        key={`${action.label}-${rowKey}`}
                        className={`btn entity-table__action ${action.className || ''}`}
                        onClick={() => action.onClick(row)}
                        type="button"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EntityTable;
