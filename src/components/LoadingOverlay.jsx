import React from 'react';

function LoadingOverlay({ message = 'Cargando...' }) {
  return (
    <div className="loading-overlay" role="status" aria-live="polite">
      <div className="loading-box">{message}</div>
    </div>
  );
}

export default LoadingOverlay;

