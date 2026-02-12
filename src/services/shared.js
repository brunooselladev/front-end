import { wait } from '../mocks';

export const withLatency = async (payload, ms = 250) => {
  await wait(ms);
  return payload;
};

export const matchesSearch = (value, term) =>
  String(value || '').toLowerCase().includes(String(term || '').toLowerCase());

export const dateOnly = (input) => new Date(input).toISOString().slice(0, 10);

