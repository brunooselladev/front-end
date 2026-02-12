import { mockMenuByRole } from '../mocks';

const normalizePath = (value = '') => value.replace('mis-acompa\u00f1ados', 'mis-acompanados');

const normalizeMenuItem = (item) => {
  const normalizedUrl = normalizePath(item.url || item.to || '');
  const normalizedSubsections = (item.subsections || []).map((sub) => ({
    ...sub,
    url: normalizePath(sub.url || sub.to || ''),
    to: normalizePath(sub.url || sub.to || ''),
  }));

  return {
    ...item,
    url: normalizedUrl,
    to: normalizedUrl,
    subsections: normalizedSubsections.length ? normalizedSubsections : undefined,
  };
};

export const menuService = {
  getMenuItems(role) {
    return (mockMenuByRole[role] || []).map(normalizeMenuItem);
  },
};
