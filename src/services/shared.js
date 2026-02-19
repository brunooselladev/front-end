import { wait } from '../mocks';

export const withLatency = async (payload, ms = 250) => {
  await wait(ms);
  return payload;
};

export const matchesSearch = (value, term) =>
  String(value || '').toLowerCase().includes(String(term || '').toLowerCase());

export const dateOnly = (input) => new Date(input).toISOString().slice(0, 10);

export const ensureArray = (value) => (Array.isArray(value) ? value : []);

const WORKSPACE_TYPE_MAP = {
  estatal: 'Estatal',
  comunitario: 'Comunitario',
  educacion: 'Educacion',
  merendero: 'Merendero',
  comedor: 'Comedor',
  deportiva: 'Deportiva',
  religiosa: 'Religiosa',
  'centro vecinal': 'Centro vecinal',
  otros: 'Otros',
};

const USER_ROLE_MAP = {
  efector: 'Efector',
  agente: 'Agente',
  referente: 'Referente',
  usmya: 'Usmya',
  admin: 'Administrador',
  administrador: 'Administrador',
};

const normalizeWorkspaceType = (value) => {
  const normalized = String(value ?? '').trim();
  if (!normalized) return null;
  const mapped = WORKSPACE_TYPE_MAP[normalized.toLowerCase()];
  return mapped || normalized;
};

const normalizeUserRole = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  const normalized = raw.toLowerCase();
  const mapped = USER_ROLE_MAP[normalized];
  if (mapped) return mapped;
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const normalizeBirthdate = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return null;

  if (raw.includes('T')) return raw;

  const parsed = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return raw;

  return parsed.toISOString();
};

export const splitAddressParts = (address, neighborhood) => {
  const normalizedAddress = String(address ?? '').trim();
  const normalizedNeighborhood = String(neighborhood ?? '').trim();

  if (!normalizedAddress) {
    return {
      direccion: '',
      barrio: normalizedNeighborhood,
    };
  }

  const chunks = normalizedAddress
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (chunks.length <= 1) {
    return {
      direccion: normalizedAddress,
      barrio: normalizedNeighborhood,
    };
  }

  const parsedBarrio = chunks[chunks.length - 1];
  const parsedDireccion = chunks.slice(0, -1).join(', ');

  return {
    direccion: parsedDireccion,
    barrio: normalizedNeighborhood || parsedBarrio,
  };
};

export const normalizeListResponse = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.response?.items)) return payload.response.items;
  if (Array.isArray(payload?.response?.views)) return payload.response.views;
  if (Array.isArray(payload?.response)) return payload.response;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.views)) return payload.views;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const normalizeEntityResponse = (payload) => {
  if (!payload) return null;
  return payload?.response || payload?.data || payload;
};

export const toUserDTO = (payload = {}) => ({
  name: String(payload.name ?? payload.nombre ?? '').trim() || null,
  lastname: String(payload.lastname ?? payload.apellido ?? '').trim() || null,
  nationalId: String(payload.nationalId ?? payload.dni ?? '').trim() || null,
  email: String(payload.email ?? '').trim() || null,
  phoneNumber: String(payload.phoneNumber ?? payload.telefono ?? '').trim() || null,
  type: String(payload.type ?? payload.tipoProfesional ?? '').trim() || null,
  birthdate: normalizeBirthdate(payload.birthdate ?? payload.fechaNacimiento),
  password: String(payload.password ?? '').trim() || null,
  role: normalizeUserRole(payload.role),
});

export const toWorkspaceDTO = (payload = {}) => ({
  name: String(payload.name ?? payload.nombre ?? '').trim() || null,
  nationalId: String(payload.nationalId ?? payload.cuit ?? payload.dni ?? '').trim() || '0',
  phoneNumber: String(payload.phoneNumber ?? payload.telefono ?? '').trim() || null,
  address:
    payload.address || payload.direccion
      ? String(payload.address ?? payload.direccion ?? '').trim() || null
      : null,
  assignee: String(payload.assignee ?? payload.encargado ?? '').trim() || null,
  type: normalizeWorkspaceType(payload.type ?? payload.tipoOrganizacion),
  device: Boolean(payload.device ?? payload.cuentaConDispositivo),
  internet: Boolean(payload.internet ?? payload.cuentaConInternet),
  categories: ensureArray(payload.categories ?? payload.poblacionVinculada),
  hours: String(payload.hours ?? payload.diasHorarios ?? '').trim() || null,
  mainActivity: String(payload.mainActivity ?? payload.actividadesPrincipales ?? '').trim() || null,
  secondaryActivity:
    String(payload.secondaryActivity ?? payload.actividadesSecundarias ?? '').trim() || null,
});

export const toWorkspaceUpdateDTO = (uuid, payload = {}) => ({
  uuid,
  name: String(payload.name ?? payload.nombre ?? '').trim() || null,
  nationalId: String(payload.nationalId ?? payload.cuit ?? payload.dni ?? '').trim() || null,
  phoneNumber: String(payload.phoneNumber ?? payload.telefono ?? '').trim() || null,
  address: String(payload.address ?? payload.direccion ?? '').trim() || null,
  assignee: String(payload.assignee ?? payload.encargado ?? '').trim() || null,
  type: normalizeWorkspaceType(payload.type ?? payload.tipoOrganizacion),
  device: Boolean(payload.device ?? payload.cuentaConDispositivo),
  internet: Boolean(payload.internet ?? payload.cuentaConInternet),
  categories: ensureArray(payload.categories ?? payload.poblacionVinculada),
  hours: String(payload.hours ?? payload.diasHorarios ?? '').trim() || null,
  mainActivity: String(payload.mainActivity ?? payload.actividadesPrincipales ?? '').trim() || null,
  secondaryActivity:
    String(payload.secondaryActivity ?? payload.actividadesSecundarias ?? '').trim() || null,
});

export const toActivityDTO = (payload = {}, fallback = {}) => {
  const source = { ...fallback, ...payload };
  const dateValue = source.assignmentDate || source.dia || source.date;
  const timeValue = source.hora || source.startTime || '00:00';
  const assignmentDate = dateValue
    ? new Date(String(dateValue).includes('T') ? dateValue : `${dateValue}T${timeValue}`).toISOString()
    : new Date().toISOString();

  return {
    name: String(source.name ?? source.nombre ?? '').trim() || null,
    description: String(source.description ?? source.descripcion ?? '').trim() || null,
    fixed: Boolean(source.fixed ?? source.esFija),
    assignmentDate,
    assigneeNationalId:
      String(source.assigneeNationalId ?? source.responsableDni ?? source.assignee ?? '').trim() || '0',
    workspaceNationalId:
      String(source.workspaceNationalId ?? source.espacioNationalId ?? source.espacioId ?? '').trim() || '0',
  };
};

export const fromWorkspaceDTO = (item = {}) => ({
  ...splitAddressParts(item.address, item.neighborhood),
  id: item.uuid,
  nombre: item.name,
  nationalId: item.nationalId,
  telefono: item.phoneNumber,
  encargado: item.assignee,
  tipoOrganizacion: item.type ?? item.workspaceType,
  cuentaConInternet: item.internet,
  cuentaConDispositivo: item.device,
  diasHorarios: item.hours,
  actividadesPrincipales: item.mainActivity,
  actividadesSecundarias: item.secondaryActivity,
  poblacionVinculada: item.categories ?? [],
  registeredDate: item.registeredDate,
  workspaceStatus: item.workspaceStatus,
});

export const fromUserDTO = (item = {}) => ({
  ...item,
  id: item.uuid ?? item.id,
  nombre: item.nombre || `${item.name || ''} ${item.lastname || ''}`.trim(),
  dni: item.dni ?? item.nationalId,
  telefono: item.telefono ?? item.phoneNumber,
  fechaNacimiento: item.fechaNacimiento ?? item.birthdate,
  direccionResidencia:
    item.direccionResidencia ?? item.direccion ?? item.address ?? item.residenceAddress ?? null,
});

export const unsupportedByContract = (area) => {
  throw new Error(`Operacion no soportada por el contrato Swagger actual: ${area}`);
};

