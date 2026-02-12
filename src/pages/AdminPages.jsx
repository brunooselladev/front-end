import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EntityTable from '../components/EntityTable';
import LoadingOverlay from '../components/LoadingOverlay';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import { activitiesService, espacioService, usuarioService } from '../services';
import { boolLabel, formatDate, formatShortDate, roleLabel } from '../utils/formatters';

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

function SpaceForm({ initialValue, onSubmit, onCancel, isSaving }) {
  const [form, setForm] = useState(() => ({
    nombre: initialValue?.nombre || '',
    telefono: initialValue?.telefono || '',
    tipoOrganizacion: initialValue?.tipoOrganizacion || 'comunitario',
    direccion: initialValue?.direccion || '',
    barrio: initialValue?.barrio || '',
    encargado: initialValue?.encargado || '',
    diasHorarios: initialValue?.diasHorarios || '',
    poblacionRaw: (initialValue?.poblacionVinculada || []).join(', '),
    cuentaConInternet: Boolean(initialValue?.cuentaConInternet),
    cuentaConDispositivo: Boolean(initialValue?.cuentaConDispositivo),
  }));

  useEffect(() => {
    setForm({
      nombre: initialValue?.nombre || '',
      telefono: initialValue?.telefono || '',
      tipoOrganizacion: initialValue?.tipoOrganizacion || 'comunitario',
      direccion: initialValue?.direccion || '',
      barrio: initialValue?.barrio || '',
      encargado: initialValue?.encargado || '',
      diasHorarios: initialValue?.diasHorarios || '',
      poblacionRaw: (initialValue?.poblacionVinculada || []).join(', '),
      cuentaConInternet: Boolean(initialValue?.cuentaConInternet),
      cuentaConDispositivo: Boolean(initialValue?.cuentaConDispositivo),
    });
  }, [initialValue]);

  const update = (key) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.nombre.trim() || !form.telefono.trim()) {
      return;
    }

    onSubmit({
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      tipoOrganizacion: form.tipoOrganizacion,
      direccion: form.direccion.trim(),
      barrio: form.barrio.trim(),
      encargado: form.encargado.trim(),
      diasHorarios: form.diasHorarios.trim(),
      poblacionVinculada: form.poblacionRaw
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      actividadEspacio: initialValue?.actividadEspacio || [],
      cuentaConInternet: form.cuentaConInternet,
      cuentaConDispositivo: form.cuentaConDispositivo,
      coordenadas: initialValue?.coordenadas || { lat: 0, lng: 0 },
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
        <div className="field">
          <label>Poblacion vinculada (coma separada)</label>
          <input value={form.poblacionRaw} onChange={update('poblacionRaw')} />
        </div>
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
    <PageShell
      title="Notificaciones de usuarios"
      subtitle="Aprobacion y rechazo de solicitudes de registro"
      actions={
        <>
          <button className="btn" type="button" onClick={loadData} disabled={loading || working}>
            Actualizar
          </button>
        </>
      }
    >
      <div className="actions-row tab-row">
        <button
          className={`btn ${selectedRole === 'agente' ? 'btn-primary' : ''}`}
          type="button"
          onClick={() => setSelectedRole('agente')}
        >
          Agentes/Efectores ({counts.agente})
        </button>
        <button
          className={`btn ${selectedRole === 'referente' ? 'btn-primary' : ''}`}
          type="button"
          onClick={() => setSelectedRole('referente')}
        >
          Referentes ({counts.referente})
        </button>
        <button
          className={`btn ${selectedRole === 'usmya' ? 'btn-primary' : ''}`}
          type="button"
          onClick={() => setSelectedRole('usmya')}
        >
          USMYA ({counts.usmya})
        </button>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <EntityTable
        columns={columns}
        rows={filtered}
        actions={[
          { label: 'Ver', onClick: (row) => openDetails(row) },
          { label: 'Aprobar', className: 'btn-primary', onClick: (row) => approveUser(row.id) },
          { label: 'Rechazar', className: 'btn-danger', onClick: (row) => rejectUser(row.id) },
        ]}
      />

      <Modal
        open={Boolean(selectedUser)}
        title="Detalle de solicitud"
        onClose={() => setSelectedUser(null)}
      >
        {selectedUser ? (
          <div className="grid">
            <p>
              <strong>Nombre:</strong> {selectedUser.nombre}
            </p>
            <p>
              <strong>Rol:</strong> {roleLabel[selectedUser.role] || selectedUser.role}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.email || '-'}
            </p>
            <p>
              <strong>DNI:</strong> {selectedUser.dni || '-'}
            </p>
            <p>
              <strong>Telefono:</strong> {selectedUser.telefono || '-'}
            </p>
            <p>
              <strong>Direccion:</strong> {selectedUser.direccionResidencia || '-'}
            </p>
            {selectedUser.idEspacio ? (
              <p>
                <strong>Espacio:</strong>{' '}
                {spacesMap.get(Number(selectedUser.idEspacio)) || `Espacio ${selectedUser.idEspacio}`}
              </p>
            ) : null}
            {selectedRelation.usmya ? (
              <p>
                <strong>USMYA asociado:</strong> {selectedRelation.usmya.nombre}
              </p>
            ) : null}
            {selectedRelation.creador ? (
              <p>
                <strong>Creador:</strong> {selectedRelation.creador.nombre} ({roleLabel[selectedRelation.creador.role]})
              </p>
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
    <PageShell
      title="Notificaciones de actividades"
      subtitle="Validacion de actividades propuestas por los espacios"
      actions={
        <>
          <button className="btn" type="button" onClick={loadData} disabled={loading || working}>
            Actualizar
          </button>
        </>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}

      <EntityTable
        columns={columns}
        rows={activities}
        actions={[
          { label: 'Ver', onClick: (row) => setSelected(row) },
          { label: 'Aprobar', className: 'btn-primary', onClick: (row) => approve(row.id) },
          { label: 'Rechazar', className: 'btn-danger', onClick: (row) => reject(row.id) },
        ]}
      />

      <Modal open={Boolean(selected)} title="Detalle de actividad" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid">
            <p>
              <strong>Nombre:</strong> {selected.nombre}
            </p>
            <p>
              <strong>Descripcion:</strong> {selected.descripcion}
            </p>
            <p>
              <strong>Fecha:</strong> {formatDate(selected.dia)}
            </p>
            <p>
              <strong>Horario:</strong> {selected.hora} {selected.horaFin ? `- ${selected.horaFin}` : ''}
            </p>
            <p>
              <strong>Responsable:</strong> {selected.responsable}
            </p>
            <p>
              <strong>Espacio:</strong>{' '}
              {spacesMap.get(Number(selected.espacioId)) || `Espacio ${selected.espacioId}`}
            </p>
            <p>
              <strong>Lugar:</strong> {selected.lugar || '-'}
            </p>
            <p>
              <strong>Es fija:</strong> {boolLabel(selected.esFija)}
            </p>
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
      const ordered = [...(data || [])].sort((a, b) => Number(b.id) - Number(a.id));
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
            Nuevo espacio
          </button>
          <button className="btn" type="button" onClick={loadData} disabled={loading || working}>
            Actualizar
          </button>
        </>
      }
    >
      <div className="actions-row">
        <input
          className="filter-input"
          placeholder="Buscar por nombre"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
          <option value="">Todos los tipos</option>
          {tipoOrganizacionOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <EntityTable
        columns={columns}
        rows={filtered}
        actions={[
          { label: 'Ver', onClick: (row) => setSelected(row) },
          { label: 'Editar', onClick: (row) => setEditing(row) },
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

      <Modal
        open={editing !== null}
        title={editing?.id ? 'Editar espacio' : 'Nuevo espacio'}
        onClose={() => setEditing(null)}
      >
        <SpaceForm
          initialValue={editing?.id ? editing : null}
          onSubmit={saveSpace}
          onCancel={() => setEditing(null)}
          isSaving={working}
        />
      </Modal>

      <Modal open={Boolean(selected) && !showDelete} title="Detalle del espacio" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid">
            <p>
              <strong>Nombre:</strong> {selected.nombre}
            </p>
            <p>
              <strong>Tipo:</strong> {selected.tipoOrganizacion}
            </p>
            <p>
              <strong>Telefono:</strong> {selected.telefono}
            </p>
            <p>
              <strong>Encargado:</strong> {selected.encargado || '-'}
            </p>
            <p>
              <strong>Direccion:</strong> {selected.direccion || '-'}
            </p>
            <p>
              <strong>Barrio:</strong> {selected.barrio || '-'}
            </p>
            <p>
              <strong>Dias/Horarios:</strong> {selected.diasHorarios || '-'}
            </p>
            <p>
              <strong>Poblacion:</strong> {(selected.poblacionVinculada || []).join(', ') || '-'}
            </p>
            <p>
              <strong>Internet:</strong> {boolLabel(selected.cuentaConInternet)}
            </p>
            <p>
              <strong>Dispositivo:</strong> {boolLabel(selected.cuentaConDispositivo)}
            </p>
          </div>
        ) : null}
      </Modal>

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
          Se eliminara <strong>{selected?.nombre}</strong>. Esta accion no se puede deshacer.
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
    <PageShell
      title="Calendario semanal"
      subtitle="Agenda semanal de actividades"
      actions={
        <button className="btn" type="button" onClick={loadData} disabled={loading}>
          Actualizar
        </button>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}

      {!activities.length && !loading ? <p>No hay actividades para la semana actual.</p> : null}

      <div className="grid">
        {Object.entries(groupedByDay).map(([day, dayActivities]) => (
          <article className="card" key={day}>
            <h3>{formatDate(day, { weekday: 'long', day: '2-digit', month: 'long' })}</h3>
            <ul className="list-clean">
              {dayActivities.map((activity) => (
                <li key={activity.id}>
                  <button className="btn btn-link" type="button" onClick={() => setSelected(activity)}>
                    {activity.hora} - {activity.nombre}
                  </button>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <Modal open={Boolean(selected)} title="Detalle de actividad" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid">
            <p>
              <strong>Nombre:</strong> {selected.nombre}
            </p>
            <p>
              <strong>Descripcion:</strong> {selected.descripcion}
            </p>
            <p>
              <strong>Fecha:</strong> {formatDate(selected.dia)}
            </p>
            <p>
              <strong>Horario:</strong> {selected.hora} {selected.horaFin ? `- ${selected.horaFin}` : ''}
            </p>
            <p>
              <strong>Espacio:</strong> {spacesMap.get(Number(selected.espacioId)) || '-'}
            </p>
            <p>
              <strong>Responsable:</strong> {selected.responsable}
            </p>
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
    <PageShell title="Prestaciones" subtitle="Recursero de actividades y servicios disponibles">
      <div className="actions-row">
        <input
          className="filter-input"
          placeholder="Buscar por nombre o descripcion"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error ? <p className="error-text">{error}</p> : null}

      <div className="grid grid-3">
        {filtered.map((activity) => (
          <article className="card" key={activity.id}>
            <h3>{activity.nombre}</h3>
            <p className="page-meta">{formatDate(activity.dia)} - {activity.hora}</p>
            <p>{activity.descripcion}</p>
            <div className="actions-row">
              <Link className="btn btn-primary btn-link" to={`/admin/recursero/prestaciones/${activity.id}`}>
                Ver detalle
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
      title="Detalle de prestacion"
      subtitle="Informacion completa de la actividad seleccionada"
      actions={
        <button className="btn" type="button" onClick={() => navigate('/admin/recursero/prestaciones')}>
          Volver
        </button>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}

      {activity ? (
        <div className="grid grid-2">
          <article className="card">
            <h3>{activity.nombre}</h3>
            <p>{activity.descripcion}</p>
            <p>
              <strong>Fecha:</strong> {formatDate(activity.dia)}
            </p>
            <p>
              <strong>Horario:</strong> {activity.hora} {activity.horaFin ? `- ${activity.horaFin}` : ''}
            </p>
            <p>
              <strong>Tipo:</strong> {activity.esFija ? 'Fija' : 'Eventual'}
            </p>
            <p>
              <strong>Responsable:</strong> {activity.responsable}
            </p>
            <p>
              <strong>Lugar:</strong> {activity.lugar || '-'}
            </p>
          </article>

          <article className="card">
            <h3>Espacio</h3>
            {space ? (
              <>
                <p>
                  <strong>Nombre:</strong> {space.nombre}
                </p>
                <p>
                  <strong>Tipo:</strong> {space.tipoOrganizacion}
                </p>
                <p>
                  <strong>Telefono:</strong> {space.telefono}
                </p>
                <p>
                  <strong>Direccion:</strong> {space.direccion || '-'}
                </p>
                <p>
                  <strong>Barrio:</strong> {space.barrio || '-'}
                </p>
                <p>
                  <strong>Poblacion:</strong> {(space.poblacionVinculada || []).join(', ') || '-'}
                </p>
              </>
            ) : (
              <p>No se encontro informacion del espacio.</p>
            )}
          </article>
        </div>
      ) : null}

      {loading && <LoadingOverlay message="Cargando detalle..." />}
    </PageShell>
  );
}

