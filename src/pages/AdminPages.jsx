import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EntityTable from '../components/EntityTable';
import LoadingOverlay from '../components/LoadingOverlay';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import { activitiesService, espacioService, usuarioService } from '../services';
import { boolLabel, formatDate, formatShortDate, roleLabel } from '../utils/formatters';
import { startOfWeek, addDays, addWeeks, subWeeks, isSameDay, format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const tipoOrganizacionOptions = [
  'estatal',
  'comunitario',
  'educacion',
  'merendero',
  'comedor',
  'deportiva',
  'religiosa',
  'centro vecinal',
  'otros',
];

const poblacionVinculadaOptions = ['Niños', 'Adolescentes', 'Jóvenes', 'Adultos', 'Mayores', 'Familias'];

function SpaceForm({ initialValue, onSubmit, onCancel, isSaving }) {
  const [form, setForm] = useState(() => ({
    nombre: initialValue?.nombre || '',
    nationalId: initialValue?.nationalId || '',
    telefono: initialValue?.telefono || '',
    tipoOrganizacion: initialValue?.tipoOrganizacion || 'comunitario',
    direccion: initialValue?.direccion || '',
    barrio: initialValue?.barrio || '',
    encargado: initialValue?.encargado || '',
    diasHorarios: initialValue?.diasHorarios || '',
    poblacionVinculada: initialValue?.poblacionVinculada || [],
    actividadesPrincipales: initialValue?.actividadesPrincipales || '',
    actividadesSecundarias: initialValue?.actividadesSecundarias || '',
    cuentaConInternet: Boolean(initialValue?.cuentaConInternet),
    cuentaConDispositivo: Boolean(initialValue?.cuentaConDispositivo),
  }));

  useEffect(() => {
    setForm({
      nombre: initialValue?.nombre || '',
      nationalId: initialValue?.nationalId || '',
      telefono: initialValue?.telefono || '',
      tipoOrganizacion: initialValue?.tipoOrganizacion || 'comunitario',
      direccion: initialValue?.direccion || '',
      barrio: initialValue?.barrio || '',
      encargado: initialValue?.encargado || '',
      diasHorarios: initialValue?.diasHorarios || '',
      poblacionVinculada: initialValue?.poblacionVinculada || [],
      actividadesPrincipales: initialValue?.actividadesPrincipales || '',
      actividadesSecundarias: initialValue?.actividadesSecundarias || '',
      cuentaConInternet: Boolean(initialValue?.cuentaConInternet),
      cuentaConDispositivo: Boolean(initialValue?.cuentaConDispositivo),
    });
  }, [initialValue]);

  const update = (key) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const togglePoblacion = (poblacion) => {
    setForm((prev) => ({
      ...prev,
      poblacionVinculada: prev.poblacionVinculada.includes(poblacion)
        ? prev.poblacionVinculada.filter((p) => p !== poblacion)
        : [...prev.poblacionVinculada, poblacion],
    }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.nombre.trim() || !form.nationalId.trim()) {
      return;
    }

    const addressParts = [form.direccion.trim(), form.barrio.trim()].filter(Boolean);

    onSubmit({
      name: form.nombre.trim(),
      nationalId: form.nationalId.trim(),
      phoneNumber: form.telefono.trim(),
      address: addressParts.join(', '),
      assignee: form.encargado.trim(),
      type: form.tipoOrganizacion,
      categories: form.poblacionVinculada,
      hours: form.diasHorarios.trim(),
      mainActivity: form.actividadesPrincipales.trim(),
      secondaryActivity: form.actividadesSecundarias.trim(),
    });
  };

  return (
    <form className="grid" onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label>Nombre</label>
          <input value={form.nombre} onChange={update('nombre')} required />
        </div>
        <div className="field">
          <label>National ID (CUIT)</label>
          <input value={form.nationalId} onChange={update('nationalId')} required />
        </div>
        <div className="field">
          <label>Telefono</label>
          <input value={form.telefono} onChange={update('telefono')} required />
        </div>
        <div className="field">
          <label>Tipo</label>
          <select value={form.tipoOrganizacion} onChange={update('tipoOrganizacion')}>
            {tipoOrganizacionOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Encargado</label>
          <input value={form.encargado} onChange={update('encargado')} />
        </div>
        <div className="field">
          <label>Direccion</label>
          <input value={form.direccion} onChange={update('direccion')} />
        </div>
        <div className="field">
          <label>Barrio</label>
          <input value={form.barrio} onChange={update('barrio')} />
        </div>
        <div className="field">
          <label>Dias y horarios</label>
          <input value={form.diasHorarios} onChange={update('diasHorarios')} />
        </div>
      </div>

      <div className="field">
        <label>Población Vinculada</label>
        <div className="field-checkboxes">
          {poblacionVinculadaOptions.map((poblacion) => (
            <label key={poblacion} className="field inline-field">
              <input
                type="checkbox"
                checked={form.poblacionVinculada.includes(poblacion)}
                onChange={() => togglePoblacion(poblacion)}
              />
              <span>{poblacion}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="field">
        <label>Actividades Principales</label>
        <textarea
          value={form.actividadesPrincipales}
          onChange={update('actividadesPrincipales')}
          placeholder="Describa las actividades principales que se realizan en este espacio"
          rows="3"
        />
      </div>

      <div className="field">
        <label>Actividades Secundarias</label>
        <textarea
          value={form.actividadesSecundarias}
          onChange={update('actividadesSecundarias')}
          placeholder="Describa las actividades secundarias (opcionales)"
          rows="3"
        />
      </div>

      <div className="actions-row">
        <label className="field inline-field">
          <input
            type="checkbox"
            checked={form.cuentaConInternet}
            onChange={update('cuentaConInternet')}
          />
          <span>Con internet</span>
        </label>
        <label className="field inline-field">
          <input
            type="checkbox"
            checked={form.cuentaConDispositivo}
            onChange={update('cuentaConDispositivo')}
          />
          <span>Con dispositivo</span>
        </label>
      </div>

      <div className="actions-row">
        <button className="btn btn-primary" type="submit" disabled={isSaving}>
          Guardar
        </button>
        <button className="btn" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function AdminNotificationsPage() {
  const [users, setUsers] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [selectedRole, setSelectedRole] = useState('agente');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRelation, setSelectedRelation] = useState({ usmya: null, creador: null });
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  const spacesMap = useMemo(() => {
    const map = new Map();
    spaces.forEach((item) => map.set(Number(item.id), item.nombre));
    return map;
  }, [spaces]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pendingUsers, allSpaces] = await Promise.all([
        usuarioService.getUsersPendingApproval(),
        espacioService.getAllEspacios(),
      ]);
      setUsers(pendingUsers || []);
      setSpaces(allSpaces || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las notificaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const counts = useMemo(() => {
    const output = { agente: 0, referente: 0, usmya: 0 };
    users.forEach((user) => {
      if (user.role === 'agente' || user.role === 'efector') output.agente += 1;
      if (user.role === 'referente') output.referente += 1;
      if (user.role === 'usmya') output.usmya += 1;
    });
    return output;
  }, [users]);

  const filtered = useMemo(() => {
    if (selectedRole === 'agente') {
      return users.filter((user) => user.role === 'agente' || user.role === 'efector');
    }
    return users.filter((user) => user.role === selectedRole);
  }, [selectedRole, users]);

  const openDetails = async (row) => {
    setSelectedUser(row);
    setSelectedRelation({ usmya: null, creador: null });

    try {
      if (row.role === 'referente') {
        const usmya = await usuarioService.getUsmyaByReferenteId(row.id);
        setSelectedRelation((prev) => ({ ...prev, usmya }));
      }
      if (row.role === 'usmya' && row.creadoPor) {
        const creador = await usuarioService.getCreadorByUsmyaId(row.id);
        setSelectedRelation((prev) => ({ ...prev, creador }));
      }
    } catch {
      // Non blocking in detail modal.
    }
  };

  const approveUser = async (userId) => {
    setWorking(true);
    try {
      await usuarioService.postVerified(userId);
      await loadData();
      if (selectedUser && Number(selectedUser.id) === Number(userId)) setSelectedUser(null);
    } catch (err) {
      setError(err.message || 'No se pudo aprobar el usuario.');
    } finally {
      setWorking(false);
    }
  };

  const rejectUser = async (userId) => {
    setWorking(true);
    try {
      await usuarioService.rejectUser(userId);
      await loadData();
      if (selectedUser && Number(selectedUser.id) === Number(userId)) setSelectedUser(null);
    } catch (err) {
      setError(err.message || 'No se pudo rechazar el usuario.');
    } finally {
      setWorking(false);
    }
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    {
      key: 'role',
      label: 'Rol',
      render: (value) => roleLabel[value] || value,
    },
    { key: 'email', label: 'Email' },
    {
      key: 'idEspacio',
      label: 'Espacio',
      render: (value) => (value ? spacesMap.get(Number(value)) || `Espacio ${value}` : '-'),
    },
  ];

  return (
    <PageShell title="Notificaciones">
      <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }} />

      {/* Tabs con badges */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '12px' }}>
        {[
          { key: 'agente', label: 'Agentes', count: counts.agente },
          { key: 'referente', label: 'Referentes', count: counts.referente },
          { key: 'usmya', label: 'Usmyas', count: counts.usmya },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedRole(key)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              paddingBottom: '8px',
              borderBottom: selectedRole === key ? '2px solid #1e293b' : '2px solid transparent',
              color: '#1e293b',
              fontWeight: selectedRole === key ? '600' : '400',
            }}
          >
            <span style={{ fontSize: '14px' }}>{label}</span>
            <span style={{
              background: '#4f46e5',
              color: '#fff',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: '700',
            }}>
              {count}
            </span>
          </button>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
        Total pendientes: {counts.agente + counts.referente + counts.usmya}
      </p>

      {error ? <p className="error-text">{error}</p> : null}

      {/* Lista de cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map((row) => (
          <div
            key={row.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              background: '#fff',
            }}
          >
            {/* Avatar + info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#6366f1',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px',
                flexShrink: 0,
              }}>
                {(row.nombre || '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px' }}>{row.nombre}</span>
                  <span style={{
                    background: '#fce7f3',
                    color: '#be185d',
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '999px',
                  }}>
                    Creado por Efector
                  </span>
                </div>
                <p style={{ margin: '2px 0 8px', color: '#6b7280', fontSize: '13px' }}>
                  DNI: {row.dni || '-'} · Hace 0 días
                </p>
                <span style={{
                  background: '#fff7ed',
                  color: '#c2410c',
                  border: '1px solid #fed7aa',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 10px',
                }}>
                  Pendiente de aprobación
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '12px' }}>
              <button
                type="button"
                title="Ver"
                onClick={() => openDetails(row)}
                style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}
              >
                👁
              </button>
              <button
                type="button"
                title="Aprobar"
                onClick={() => approveUser(row.id)}
                disabled={working}
                style={{ background: 'none', border: '1px solid #bbf7d0', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}
              >
                ✓
              </button>
              <button
                type="button"
                title="Rechazar"
                onClick={() => rejectUser(row.id)}
                disabled={working}
                style={{ background: 'none', border: '1px solid #fecaca', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal detalle */}
      <Modal open={Boolean(selectedUser)} title="Detalle de solicitud" onClose={() => setSelectedUser(null)}>
        {selectedUser ? (
          <div className="grid">
            <p><strong>Nombre:</strong> {selectedUser.nombre}</p>
            <p><strong>Rol:</strong> {roleLabel[selectedUser.role] || selectedUser.role}</p>
            <p><strong>Email:</strong> {selectedUser.email || '-'}</p>
            <p><strong>DNI:</strong> {selectedUser.dni || '-'}</p>
            <p><strong>Telefono:</strong> {selectedUser.telefono || '-'}</p>
            <p><strong>Direccion:</strong> {selectedUser.direccionResidencia || '-'}</p>
            {selectedUser.idEspacio ? (
              <p><strong>Espacio:</strong> {spacesMap.get(Number(selectedUser.idEspacio)) || `Espacio ${selectedUser.idEspacio}`}</p>
            ) : null}
            {selectedRelation.usmya ? (
              <p><strong>USMYA asociado:</strong> {selectedRelation.usmya.nombre}</p>
            ) : null}
            {selectedRelation.creador ? (
              <p><strong>Creador:</strong> {selectedRelation.creador.nombre} ({roleLabel[selectedRelation.creador.role]})</p>
            ) : null}
          </div>
        ) : null}
      </Modal>

      {(loading || working) && <LoadingOverlay message="Procesando notificaciones..." />}
    </PageShell>
  );
}

export function AdminNotificationsActivitiesPage() {
  const [activities, setActivities] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  const spacesMap = useMemo(() => {
    const map = new Map();
    spaces.forEach((item) => map.set(Number(item.id), item.nombre));
    return map;
  }, [spaces]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [pendingActivities, allSpaces] = await Promise.all([
        activitiesService.getUnverifiedActivities(),
        espacioService.getAllEspacios(),
      ]);
      setActivities(pendingActivities || []);
      setSpaces(allSpaces || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las actividades pendientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = async (id) => {
    setWorking(true);
    try {
      await activitiesService.updateActivity(id, { isVerified: true });
      await loadData();
      if (selected && Number(selected.id) === Number(id)) setSelected(null);
    } catch (err) {
      setError(err.message || 'No se pudo aprobar la actividad.');
    } finally {
      setWorking(false);
    }
  };

  const reject = async (id) => {
    setWorking(true);
    try {
      await activitiesService.deleteActivity(id);
      await loadData();
      if (selected && Number(selected.id) === Number(id)) setSelected(null);
    } catch (err) {
      setError(err.message || 'No se pudo rechazar la actividad.');
    } finally {
      setWorking(false);
    }
  };

  const columns = [
    { key: 'nombre', label: 'Actividad' },
    {
      key: 'dia',
      label: 'Fecha',
      render: (value) => formatShortDate(value),
    },
    { key: 'hora', label: 'Horario' },
    {
      key: 'espacioId',
      label: 'Espacio',
      render: (value) => spacesMap.get(Number(value)) || `Espacio ${value}`,
    },
    {
      key: 'esFija',
      label: 'Tipo',
      render: (value) => (value ? 'Fija' : 'Eventual'),
    },
  ];

  return (
    <PageShell title="Actividades Pendientes">
      <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }} />

      {error ? <p className="error-text">{error}</p> : null}

      {/* Lista de cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto' }}>
        {activities.map((row) => (
          <div
            key={row.id}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              background: '#fff',
            }}
          >
            {/* Avatar + info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#6366f1',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '18px',
                flexShrink: 0,
              }}>
                {(row.nombre || '?')[0].toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', fontSize: '15px' }}>{row.nombre}</span>
                </div>
                <p style={{ margin: '2px 0 8px', color: '#6b7280', fontSize: '13px' }}>
                  {spacesMap.get(Number(row.espacioId)) || `Espacio ${row.espacioId}`} · Hace 0 días
                </p>
                <span style={{
                  background: '#fff7ed',
                  color: '#c2410c',
                  border: '1px solid #fed7aa',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: '600',
                  padding: '2px 10px',
                }}>
                  Pendiente de aprobación
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '12px' }}>
              <button
                type="button"
                title="Ver"
                onClick={() => setSelected(row)}
                style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}
              >
                👁
              </button>
              <button
                type="button"
                title="Aprobar"
                onClick={() => approve(row.id)}
                disabled={working}
                style={{ background: 'none', border: '1px solid #bbf7d0', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}
              >
                ✓
              </button>
              <button
                type="button"
                title="Rechazar"
                onClick={() => reject(row.id)}
                disabled={working}
                style={{ background: 'none', border: '1px solid #fecaca', borderRadius: '8px', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal detalle */}
      <Modal open={Boolean(selected)} title="Detalle de actividad" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid">
            <p><strong>Nombre:</strong> {selected.nombre}</p>
            <p><strong>Descripcion:</strong> {selected.descripcion}</p>
            <p><strong>Fecha:</strong> {formatDate(selected.dia)}</p>
            <p><strong>Horario:</strong> {selected.hora} {selected.horaFin ? `- ${selected.horaFin}` : ''}</p>
            <p><strong>Responsable:</strong> {selected.responsable}</p>
            <p><strong>Espacio:</strong> {spacesMap.get(Number(selected.espacioId)) || `Espacio ${selected.espacioId}`}</p>
            <p><strong>Lugar:</strong> {selected.lugar || '-'}</p>
            <p><strong>Es fija:</strong> {boolLabel(selected.esFija)}</p>
          </div>
        ) : null}
      </Modal>

      {(loading || working) && <LoadingOverlay message="Procesando actividades..." />}
    </PageShell>
  );
}

export function AdminSpacesPage() {
  const [spaces, setSpaces] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await espacioService.getAllEspacios();
      const ordered = [...(data?.views || [])].sort((a, b) => Number(b.id) - Number(a.id));
      setSpaces(ordered);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los espacios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return spaces.filter((space) => {
      const bySearch = search.trim()
        ? String(space.nombre || '').toLowerCase().includes(search.trim().toLowerCase())
        : true;
      const byType = typeFilter ? space.tipoOrganizacion === typeFilter : true;
      return bySearch && byType;
    });
  }, [search, spaces, typeFilter]);

  const saveSpace = async (payload) => {
    setWorking(true);
    setError('');
    try {
      if (editing?.id) {
        await espacioService.updateEspacio(editing.id, payload);
      } else {
        await espacioService.createEspacio(payload);
      }
      setEditing(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'No se pudo guardar el espacio.');
    } finally {
      setWorking(false);
    }
  };

  const deleteSpace = async () => {
    if (!selected?.id) return;
    setWorking(true);
    setError('');
    try {
      await espacioService.deleteEspacio(selected.id);
      setShowDelete(false);
      setSelected(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el espacio.');
    } finally {
      setWorking(false);
    }
  };

  const columns = [
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipoOrganizacion', label: 'Tipo' },
    { key: 'telefono', label: 'Telefono' },
    { key: 'barrio', label: 'Barrio' },
  ];

  return (
    <PageShell
      title="Espacios"
      subtitle="Gestion de espacios e instituciones"
      actions={
        <>
          <button className="btn btn-primary" type="button" onClick={() => setEditing({})}>
            Nuevo Espacio
          </button>
        </>
      }
    >
      {/* Filtros */}
      <div className="filtros-card">
        <h3 className="filtros-title">Filtros</h3>
        <div className="filtros-row">
          <div className="filtro-group">
            <label className="filtro-label">Nombre</label>
            <input
              className="filtro-input"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="filtro-group">
            <label className="filtro-label">Tipo</label>
            <select
              className="filtro-select"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="">Todos</option>
              {tipoOrganizacionOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="filtros-count">{filtered.length} elementos en total</p>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <EntityTable
        columns={columns}
        rows={filtered}
        actions={[
          { label: 'Ver', onClick: (row) => { setSelected(row); setEditing(null); } },
          { label: 'Editar', onClick: (row) => { setEditing(row); setSelected(null); } },
          {
            label: 'Eliminar',
            className: 'btn-danger',
            onClick: (row) => {
              setSelected(row);
              setShowDelete(true);
            },
          },
        ]}
      />

      {/* --- DRAWER OVERLAY --- */}
      {(Boolean(selected && !showDelete) || editing !== null) && (
        <div
          className="drawer-overlay"
          onClick={() => { setSelected(null); setEditing(null); }}
        />
      )}

      {/* --- DRAWER: Ver Detalle --- */}
      <div className={`drawer ${Boolean(selected && !showDelete) ? 'drawer--open' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">Detalle de Espacio</h2>
          <button
            className="drawer-close"
            type="button"
            onClick={() => setSelected(null)}
          >
            ×
          </button>
        </div>

        {selected && !showDelete && (
          <div className="drawer-body">
            <section className="detail-section">
              <h3 className="detail-section-title">Información General</h3>
              <div className="detail-row">
                <span className="detail-label">Nombre:</span>
                <span className="detail-value">{selected.nombre}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tipo de Organización:</span>
                <span className="detail-value">{selected.tipoOrganizacion}</span>
              </div>
            </section>

            <section className="detail-section">
              <h3 className="detail-section-title">Información de Contacto</h3>
              <div className="detail-row">
                <span className="detail-label">Teléfono:</span>
                <span className="detail-value">{selected.telefono || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dirección:</span>
                <span className="detail-value">{selected.direccion || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Barrio:</span>
                <span className="detail-value">{selected.barrio || '-'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Encargado:</span>
                <span className="detail-value">{selected.encargado || '-'}</span>
              </div>
            </section>

            {selected.poblacionVinculada?.length > 0 && (
              <section className="detail-section">
                <h3 className="detail-section-title">Población Vinculada</h3>
                <div className="detail-tags">
                  {(selected.poblacionVinculada || []).map((tag) => (
                    <span key={tag} className="detail-tag">{tag}</span>
                  ))}
                </div>
              </section>
            )}

            <section className="detail-section">
              <h3 className="detail-section-title">Horarios y Actividades</h3>
              <div className="detail-row">
                <span className="detail-label">Días y Horarios:</span>
                <span className="detail-value">{selected.diasHorarios || '-'}</span>
              </div>
              {selected.actividadesPrincipales && (
                <div className="detail-row">
                  <span className="detail-label">Actividades Principales:</span>
                  <span className="detail-value">{selected.actividadesPrincipales}</span>
                </div>
              )}
              {selected.actividadesSecundarias && (
                <div className="detail-row">
                  <span className="detail-label">Actividades Secundarias:</span>
                  <span className="detail-value">{selected.actividadesSecundarias}</span>
                </div>
              )}
            </section>

            <section className="detail-section">
              <h3 className="detail-section-title">Recursos</h3>
              <div className="detail-row">
                <span className="detail-label">Internet:</span>
                <span className="detail-value">{boolLabel(selected.cuentaConInternet)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Dispositivo:</span>
                <span className="detail-value">{boolLabel(selected.cuentaConDispositivo)}</span>
              </div>
            </section>
          </div>
        )}
      </div>

      {/* --- DRAWER: Editar / Nuevo --- */}
      <div className={`drawer ${editing !== null ? 'drawer--open' : ''}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">{editing?.id ? 'Editar Espacio' : 'Nuevo Espacio'}</h2>
          <button
            className="drawer-close"
            type="button"
            onClick={() => setEditing(null)}
          >
            ×
          </button>
        </div>

        {editing !== null && (
          <div className="drawer-body">
            <SpaceForm
              initialValue={editing?.id ? editing : null}
              onSubmit={saveSpace}
              onCancel={() => setEditing(null)}
              isSaving={working}
            />
          </div>
        )}
      </div>

      {/* --- MODAL: Confirmar Eliminar --- */}
      <Modal
        open={showDelete}
        title="Eliminar espacio"
        onClose={() => setShowDelete(false)}
        actions={
          <>
            <button className="btn btn-danger" type="button" onClick={deleteSpace} disabled={working}>
              Eliminar
            </button>
            <button className="btn" type="button" onClick={() => setShowDelete(false)}>
              Cancelar
            </button>
          </>
        }
      >
        <p>
          Se eliminará <strong>{selected?.nombre}</strong>. Esta acción no se puede deshacer.
        </p>
      </Modal>

      {(loading || working) && <LoadingOverlay message="Procesando espacios..." />}
    </PageShell>
  );
}

export function AdminCalendarPage() {
  const [activities, setActivities] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // Estado adicional
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  // Derivados
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 07:00–19:00
  const DAY_LABELS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

  const weekLabel = format(weekStart, "MMMM 'De' yyyy", { locale: es });

  const prevWeek = () => setWeekStart(w => subWeeks(w, 1));
  const nextWeek = () => setWeekStart(w => addWeeks(w, 1));
  const goToToday = () => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const getActivitiesForSlot = (day, hour) =>
    activities.filter(a => {
      const actDay = parseISO(a.dia);
      const actHour = parseInt(a.hora?.split(':')[0] ?? '0', 10);
      return isSameDay(actDay, day) && actHour === hour;
    });

  const spacesMap = useMemo(() => {
    const map = new Map();
    spaces.forEach((item) => map.set(Number(item.id), item.nombre));
    return map;
  }, [spaces]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [weekActivities, allSpaces] = await Promise.all([
        activitiesService.getCurrentWeekActivities(),
        espacioService.getAllEspacios(),
      ]);
      const ordered = [...(weekActivities || [])].sort(
        (a, b) => new Date(a.dia).getTime() - new Date(b.dia).getTime()
      );
      setActivities(ordered);
      setSpaces(allSpaces || []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el calendario semanal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const groupedByDay = useMemo(() => {
    const output = {};
    activities.forEach((activity) => {
      const dayKey = new Date(activity.dia).toISOString().slice(0, 10);
      if (!output[dayKey]) output[dayKey] = [];
      output[dayKey].push(activity);
    });
    return output;
  }, [activities]);

  return (
    <PageShell title="Calendario semanal">
      <div style={{ borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }} />

      {error ? <p className="error-text">{error}</p> : null}

      {/* Contenedor del calendario */}
      <div style={{
        border: '1px solid #c7d2fe',
        borderRadius: '12px',
        overflow: 'hidden',
        maxWidth: '1060px',
        margin: '0 auto',
      }}>
        {/* Header: navegación */}
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={prevWeek}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', width: '36px', height: '36px', color: '#fff', cursor: 'pointer', fontSize: '16px' }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextWeek}
              style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', width: '36px', height: '36px', color: '#fff', cursor: 'pointer', fontSize: '16px' }}
            >
              ›
            </button>
          </div>

          <span style={{ fontWeight: '700', fontSize: '18px' }}>
            {weekLabel} {/* ej: "Febrero De 2026" */}
          </span>

          <button
            type="button"
            onClick={goToToday}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', padding: '6px 14px', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}
          >
            Hoy
          </button>
        </div>

        {/* Grid */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {/* Columna de horas */}
                <th style={{ width: '60px', background: '#fff', borderBottom: '1px solid #e5e7eb' }} />
                {weekDays.map((day, i) => {
                  const isToday = isSameDay(day, new Date());
                  return (
                    <th
                      key={i}
                      style={{
                        padding: '10px 4px',
                        textAlign: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: isToday ? '#4f46e5' : '#374151',
                        background: '#fff',
                        borderBottom: '1px solid #e5e7eb',
                        borderLeft: '1px solid #e5e7eb',
                      }}
                    >
                      {DAY_LABELS[i]} {format(day, 'd')}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour}>
                  {/* Etiqueta de hora */}
                  <td style={{
                    padding: '0 8px',
                    fontSize: '11px',
                    color: '#9ca3af',
                    textAlign: 'right',
                    verticalAlign: 'top',
                    paddingTop: '4px',
                    borderBottom: '1px solid #f3f4f6',
                    whiteSpace: 'nowrap',
                  }}>
                    {String(hour).padStart(2, '0')}:00
                  </td>
                  {weekDays.map((day, di) => {
                    const isToday = isSameDay(day, new Date());
                    const cellActivities = getActivitiesForSlot(day, hour); // filtrar por día y hora
                    return (
                      <td
                        key={di}
                        style={{
                          borderLeft: '1px solid #e5e7eb',
                          borderBottom: '1px solid #f3f4f6',
                          height: '46px',
                          verticalAlign: 'top',
                          padding: '2px',
                          background: isToday ? '#fefce8' : '#fff',
                        }}
                      >
                        {cellActivities.map((act) => (
                          <button
                            key={act.id}
                            type="button"
                            onClick={() => setSelected(act)}
                            style={{
                              display: 'block',
                              width: '100%',
                              background: '#6366f1',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '11px',
                              padding: '2px 4px',
                              cursor: 'pointer',
                              textAlign: 'left',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              marginBottom: '2px',
                            }}
                          >
                            {act.nombre}
                          </button>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalle */}
      <Modal open={Boolean(selected)} title="Detalle de actividad" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid">
            <p><strong>Nombre:</strong> {selected.nombre}</p>
            <p><strong>Descripcion:</strong> {selected.descripcion}</p>
            <p><strong>Fecha:</strong> {formatDate(selected.dia)}</p>
            <p><strong>Horario:</strong> {selected.hora} {selected.horaFin ? `- ${selected.horaFin}` : ''}</p>
            <p><strong>Espacio:</strong> {spacesMap.get(Number(selected.espacioId)) || '-'}</p>
            <p><strong>Responsable:</strong> {selected.responsable}</p>
          </div>
        ) : null}
      </Modal>

      {loading && <LoadingOverlay message="Cargando calendario..." />}
    </PageShell>
  );
}

export function AdminBenefitsPage() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await activitiesService.getAllActivities();
      setActivities(data || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las prestaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return activities;
    const term = search.trim().toLowerCase();
    return activities.filter(
      (item) =>
        String(item.nombre || '').toLowerCase().includes(term) ||
        String(item.descripcion || '').toLowerCase().includes(term)
    );
  }, [activities, search]);

  return (
    <PageShell title="Prestaciones" subtitle="Aquí podrás gestionar todas las prestaciones disponibles en el sistema.">
      <style>{`
        .prest-search {
          width: 100%;
          padding: 12px 18px;
          border: 1.5px solid #d6ddf5;
          border-radius: 12px;
          font-size: 14px;
          color: #1a2340;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
          box-shadow: 0 2px 8px rgba(80,100,200,.06);
          margin-bottom: 28px;
          box-sizing: border-box;
        }
        .prest-search:focus {
          border-color: #5b7cf6;
          box-shadow: 0 0 0 3px rgba(91,124,246,.15);
        }
        .prest-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }
        .prest-card {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(80,100,200,.13);
          background: #fff;
          display: flex;
          flex-direction: column;
          transition: transform .18s, box-shadow .18s;
        }
        .prest-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 32px rgba(80,100,200,.22);
        }
        .prest-card__header {
          background: linear-gradient(120deg, #5b7cf6 0%, #8fa8ff 100%);
          padding: 18px 20px 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .prest-card__icon {
          background: rgba(255,255,255,.18);
          border-radius: 10px;
          width: 46px; height: 46px;
          display: flex; align-items: center; justify-content: center;
        }
        .prest-card__badge {
          background: rgba(255,255,255,.22);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.4);
        }
        .prest-card__body {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .prest-card__title {
          font-size: 17px;
          font-weight: 700;
          color: #1a2340;
          margin: 0;
        }
        .prest-card__meta {
          list-style: none;
          margin: 0; padding: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }
        .prest-card__meta li {
          font-size: 13px;
          color: #4a5578;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .prest-card__desc {
          font-size: 13px;
          color: #6b738f;
          line-height: 1.5;
          margin: 0;
          flex: 1;
        }
        .prest-card__btn {
          display: block;
          background: linear-gradient(90deg, #5b7cf6, #8fa8ff);
          color: #fff !important;
          text-align: center;
          padding: 10px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .8px;
          text-decoration: none;
          transition: opacity .15s;
          margin-top: 8px;
        }
        .prest-card__btn:hover { opacity: .88; }
      `}</style>

      {error ? <p className="error-text">{error}</p> : null}

      <input
        className="prest-search"
        placeholder="Buscar por nombre o descripción..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="prest-grid">
        {filtered.map((activity) => (
          <article className="prest-card" key={activity.id}>
            <div className="prest-card__header">
              <span className="prest-card__icon">
                <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
                  <rect x="3" y="4" width="18" height="18" rx="3" stroke="white" strokeWidth="1.8" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <rect x="7" y="14" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="11" y="14" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="15" y="14" width="2" height="2" rx="0.5" fill="white" />
                </svg>
              </span>
              <span className="prest-card__badge">{activity.esFija ? 'FIJA' : 'EVENTUAL'}</span>
            </div>

            <div className="prest-card__body">
              <h3 className="prest-card__title">{activity.nombre}</h3>

              <ul className="prest-card__meta">
                <li>
                  <span>📅</span>
                  {formatDate(activity.dia)}
                </li>
                <li>
                  <span>🕐</span>
                  {activity.hora}{activity.horaFin ? ` - ${activity.horaFin}` : ''}
                </li>
                {activity.lugar && (
                  <li>
                    <span>📍</span>
                    {activity.lugar}
                  </li>
                )}
                {activity.responsable && (
                  <li>
                    <span>👤</span>
                    {activity.responsable}
                  </li>
                )}
              </ul>

              <p className="prest-card__desc">
                {activity.descripcion?.length > 80
                  ? activity.descripcion.slice(0, 80) + '…'
                  : activity.descripcion}
              </p>

              <Link className="prest-card__btn" to={`/admin/recursero/prestaciones/${activity.id}`}>
                VER DETALLES
              </Link>
            </div>
          </article>
        ))}
      </div>

      {loading && <LoadingOverlay message="Cargando prestaciones..." />}
    </PageShell>
  );
}

export function AdminBenefitDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activity, setActivity] = useState(null);
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      setLoading(true);
      setError('');
      try {
        const activityData = await activitiesService.getActivityById(id);
        if (!activityData) {
          if (mounted) setError('No se encontro la actividad.');
          return;
        }

        const spaceData = await espacioService.getEspacioById(activityData.espacioId);

        if (mounted) {
          setActivity(activityData);
          setSpace(spaceData);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'No se pudo cargar el detalle.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  return (
    <PageShell
      title={
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#1a2340' }}
          onClick={() => navigate('/admin/recursero/prestaciones')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#5b7cf6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Detalle de la prestación
        </span>
      }
    >
      <style>{`
        .det-divider {
          height: 1.5px;
          background: linear-gradient(90deg, #d6ddf5, transparent);
          margin: 0 0 28px;
        }
        .det-hero {
          background: linear-gradient(120deg, #4a6cf7 0%, #8fa8ff 100%);
          border-radius: 16px;
          padding: 28px 32px;
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }
        .det-hero__icon {
          background: rgba(255,255,255,.15);
          border-radius: 16px;
          width: 80px; height: 80px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .det-hero__name {
          font-size: 24px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 4px;
        }
        .det-hero__sub {
          font-size: 14px;
          color: rgba(255,255,255,.8);
          margin: 0;
        }
        .det-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        @media (max-width: 640px) { .det-grid { grid-template-columns: 1fr; } }
        .det-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 16px rgba(80,100,200,.10);
          overflow: hidden;
        }
        .det-card__head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 20px 14px;
          border-bottom: 1.5px solid #eef1fb;
        }
        .det-card__head-title {
          font-weight: 700;
          font-size: 15px;
          color: #1a2340;
        }
        .det-card__body {
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .det-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .det-row__icon { font-size: 18px; flex-shrink: 0; margin-top: 1px; }
        .det-row__label {
          display: block;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          color: #5b7cf6;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .det-row__value {
          display: block;
          font-size: 14px;
          color: #1a2340;
          font-weight: 500;
        }
        .det-desc-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 16px rgba(80,100,200,.10);
          overflow: hidden;
        }
        .det-desc-card__head {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 16px 20px 14px;
          border-bottom: 1.5px solid #eef1fb;
        }
        .det-desc-card__icon-wrap {
          background: linear-gradient(135deg, #dde4ff, #c4d0ff);
          border-radius: 10px;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
        }
        .det-desc-card__title {
          font-weight: 700;
          font-size: 15px;
          color: #1a2340;
        }
        .det-desc-card__text {
          padding: 18px 20px;
          font-size: 14px;
          color: #4a5578;
          line-height: 1.7;
          margin: 0;
        }
      `}</style>

      <div className="det-divider" />

      {error ? <p className="error-text">{error}</p> : null}

      {activity ? (
        <>
          {/* Hero banner */}
          <div className="det-hero">
            <div className="det-hero__icon">
              <svg viewBox="0 0 48 48" fill="none" width="52" height="52">
                <rect x="4" y="8" width="40" height="36" rx="7" fill="rgba(255,255,255,.18)" />
                <rect x="4" y="8" width="40" height="36" rx="7" stroke="rgba(255,255,255,.6)" strokeWidth="2" />
                <path d="M34 4v8M14 4v8M4 20h40" stroke="rgba(255,255,255,.8)" strokeWidth="2.2" strokeLinecap="round" />
                <rect x="13" y="28" width="5" height="5" rx="1.2" fill="white" opacity=".7" />
                <rect x="22" y="28" width="5" height="5" rx="1.2" fill="white" opacity=".7" />
                <rect x="31" y="28" width="5" height="5" rx="1.2" fill="white" opacity=".7" />
                <rect x="13" y="36" width="5" height="5" rx="1.2" fill="white" opacity=".5" />
                <rect x="22" y="36" width="5" height="5" rx="1.2" fill="white" opacity=".5" />
              </svg>
            </div>
            <div>
              <h2 className="det-hero__name">{activity.nombre}</h2>
              <p className="det-hero__sub">Actividad {activity.esFija ? 'Fija' : 'Eventual'}</p>
            </div>
          </div>

          {/* Tarjetas info + ubicación */}
          <div className="det-grid">
            <div className="det-card">
              <div className="det-card__head">
                <span style={{ fontSize: 20 }}>📋</span>
                <span className="det-card__head-title">Información de la Actividad</span>
              </div>
              <div className="det-card__body">
                <div className="det-row">
                  <span className="det-row__icon">📅</span>
                  <div>
                    <span className="det-row__label">Fecha</span>
                    <span className="det-row__value">{formatDate(activity.dia)}</span>
                  </div>
                </div>
                <div className="det-row">
                  <span className="det-row__icon">🕐</span>
                  <div>
                    <span className="det-row__label">Horario</span>
                    <span className="det-row__value">
                      {activity.hora}{activity.horaFin ? ` - ${activity.horaFin}` : ''}
                    </span>
                  </div>
                </div>
                {space && (
                  <div className="det-row">
                    <span className="det-row__icon">🏢</span>
                    <div>
                      <span className="det-row__label">Espacio</span>
                      <span className="det-row__value">{space.nombre}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="det-card">
              <div className="det-card__head">
                <span style={{ fontSize: 20 }}>📍</span>
                <span className="det-card__head-title">Ubicación</span>
              </div>
              <div className="det-card__body">
                <div className="det-row">
                  <span className="det-row__icon">🏠</span>
                  <div>
                    <span className="det-row__label">Lugar</span>
                    <span className="det-row__value">{activity.lugar || '-'}</span>
                  </div>
                </div>
                {space && (
                  <>
                    <div className="det-row">
                      <span className="det-row__icon">🗺️</span>
                      <div>
                        <span className="det-row__label">Dirección</span>
                        <span className="det-row__value">{space.direccion || '-'}</span>
                      </div>
                    </div>
                    <div className="det-row">
                      <span className="det-row__icon">🏘️</span>
                      <div>
                        <span className="det-row__label">Barrio</span>
                        <span className="det-row__value">{space.barrio || '-'}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="det-desc-card">
            <div className="det-desc-card__head">
              <div className="det-desc-card__icon-wrap">✍️</div>
              <span className="det-desc-card__title">Descripción de la Actividad</span>
            </div>
            <p className="det-desc-card__text">
              {activity.descripcion || 'Sin descripción disponible.'}
            </p>
          </div>
        </>
      ) : null}

      {loading && <LoadingOverlay message="Cargando detalle..." />}
    </PageShell>
  );
}
