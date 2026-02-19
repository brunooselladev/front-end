﻿import { useAuthStore } from '../store/authStore';

const envValue = (key, fallback) => {
  const value = import.meta.env[key];
  return value === undefined ? fallback : value;
};

// export const API_BASE_URL = envValue('VITE_API_BASE_URL', 'http://localhost:3000/api');
export const API_BASE_URL = '/api';
export const USE_MOCKS = String(envValue('VITE_USE_MOCKS', 'false')).toLowerCase() !== 'false';

export async function apiFetch(path, options = {}) {
  const token = useAuthStore.getState().token;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers,
    ...options,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || `Request failed: ${response.status}`;
    throw new Error(message);
  }

  return payload;
}
