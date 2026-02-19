﻿import { useAuthStore } from '../store/authStore';

const envValue = (key, fallback) => {
  const value = import.meta.env[key];
  return value === undefined ? fallback : value;
};

// export const API_BASE_URL = envValue('VITE_API_BASE_URL', 'http://localhost:3000/api');
export const API_BASE_URL = '/api';
export const USE_MOCKS = String(envValue('VITE_USE_MOCKS', 'false')).toLowerCase() !== 'false';

const normalizeToken = (token) => {
  const value = String(token || '').trim();
  if (!value) return null;
  return value.toLowerCase().startsWith('bearer ') ? value.slice(7).trim() : value;
};

const readPersistedToken = () => {
  const direct = normalizeToken(localStorage.getItem('jwtToken'));
  if (direct) return direct;

  try {
    const persisted = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    return normalizeToken(persisted?.state?.token);
  } catch {
    return null;
  }
};

const resolveAuthToken = () => {
  const storeToken = normalizeToken(useAuthStore.getState().token);
  return storeToken || readPersistedToken();
};

export async function apiFetch(path, options = {}) {
  const token = resolveAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const request = {
    credentials: 'include',
    headers,
    ...options,
  };

  let response = await fetch(`${API_BASE_URL}${path}`, request);

  if (response.status === 401 && !headers.Authorization) {
    const fallbackToken = readPersistedToken();
    if (fallbackToken) {
      response = await fetch(`${API_BASE_URL}${path}`, {
        ...request,
        headers: {
          ...headers,
          Authorization: `Bearer ${fallbackToken}`,
        },
      });
    }
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message =
      payload?.message ||
      (response.status === 401
        ? 'No autorizado (401). Verificá sesión/token para este usuario.'
        : `Request failed: ${response.status}`);
    throw new Error(message);
  }

  return payload;
}
