export const roleLabel = {
  admin: 'Administrador',
  agente: 'Agente comunitario',
  efector: 'Efector de salud',
  referente: 'Referente afectivo',
  usmya: 'USMYA',
};

export const boolLabel = (value) => (value ? 'Si' : 'No');

export const formatDate = (value, options = {}) => {
  if (!value) return '-';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('es-AR', options);
};

export const formatShortDate = (value) =>
  formatDate(value, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

export const toDateInput = (value) => {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

export const nowDateInput = () => new Date().toISOString().slice(0, 10);

export const formatDateTimeLabel = (date, time) => {
  if (!date) return time || '-';
  return `${formatShortDate(date)} ${time || ''}`.trim();
};

