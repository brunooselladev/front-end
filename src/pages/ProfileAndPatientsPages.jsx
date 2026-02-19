import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EntityTable from '../components/EntityTable';
import LoadingOverlay from '../components/LoadingOverlay';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import { useCurrentUser } from '../hooks/useCurrentUser';
import {
  activitiesService,
  efectorUsmyaService,
  espacioService,
  referenteUsmyaService,
  registerService,
  usuarioService,
} from '../services';
import { formatDate, formatShortDate } from '../utils/formatters';
import { PersonalDataForm, SummaryEditor, summaryDefaults, UserTabs } from './SharedUserForms';

export function RegisterUsmyaPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useCurrentUser();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    fechaNacimiento: '',
    telefono: '',
    direccionResidencia: '',
    alias: '',
    generoAutoPercibido: '',
    estadoCivil: '',
    obraSocial: '',
    password: 'Usmya2024*',
  });

  const mode = location.pathname.startsWith('/efector/pacientes/nuevo-paciente') ? 'efector' : 'agente';

  const update = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setOk('');
    if (!form.nombre.trim() || !form.dni.trim()) {
      setError('Completa al menos nombre y DNI.');
      return;
    }

    setSaving(true);
    try {
      const response = await registerService.postUsmya({
        nombre: form.nombre.trim(),
        dni: Number(form.dni),
        fechaNacimiento: form.fechaNacimiento || null,
        telefono: form.telefono || null,
        direccionResidencia: form.direccionResidencia || null,
        alias: form.alias || null,
        generoAutoPercibido: form.generoAutoPercibido || null,
        estadoCivil: form.estadoCivil || null,
        obraSocial: form.obraSocial || null,
        creadoPor: currentUser?.id || null,
        password: form.password || 'Usmya2024*',
        requiereAprobacion: true,
      });

      if (mode === 'efector' && response?.data?.id && currentUser?.id) {
        await efectorUsmyaService.create({
          idEfector: currentUser.id,
          idUsmya: response.data.id,
        });
      }

      setOk(response?.message || 'USMYA registrado correctamente.');
      setTimeout(() => navigate(mode === 'efector' ? '/efector/pacientes' : '/agente/asistencia'), 700);
    } catch (err) {
      setError(err.message || 'No se pudo registrar USMYA.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      title={mode === 'efector' ? 'Nuevo paciente' : 'Registro de USMYA'}
      subtitle="Alta interna desde el panel de trabajo"
    >
      <form className="grid" onSubmit={submit}>
        <div className="form-grid">
          <div className="field">
            <label>Nombre</label>
            <input value={form.nombre} onChange={update('nombre')} required />
          </div>
          <div className="field">
            <label>DNI</label>
            <input value={form.dni} onChange={update('dni')} required />
          </div>
          <div className="field">
            <label>Fecha de nacimiento</label>
            <input type="date" value={form.fechaNacimiento} onChange={update('fechaNacimiento')} />
          </div>
          <div className="field">
            <label>Telefono</label>
            <input value={form.telefono} onChange={update('telefono')} />
          </div>
          <div className="field">
            <label>Direccion</label>
            <input value={form.direccionResidencia} onChange={update('direccionResidencia')} />
          </div>
          <div className="field">
            <label>Alias</label>
            <input value={form.alias} onChange={update('alias')} />
          </div>
          <div className="field">
            <label>Genero autopercibido</label>
            <input value={form.generoAutoPercibido} onChange={update('generoAutoPercibido')} />
          </div>
          <div className="field">
            <label>Estado civil</label>
            <input value={form.estadoCivil} onChange={update('estadoCivil')} />
          </div>
          <div className="field">
            <label>Obra social</label>
            <input value={form.obraSocial} onChange={update('obraSocial')} />
          </div>
        </div>
        {error ? <p className="error-text">{error}</p> : null}
        {ok ? <p className="success-text">{ok}</p> : null}
        <div className="actions-row">
          <button className="btn btn-primary" type="submit" disabled={saving}>
            Registrar
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => navigate(mode === 'efector' ? '/efector/pacientes' : '/agente/asistencia')}
          >
            Cancelar
          </button>
        </div>
      </form>
      {saving ? <LoadingOverlay message="Registrando usuario..." /> : null}
    </PageShell>
  );
}

function ActivityFormModal({ activity, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({
    nombre: activity?.nombre || '',
    descripcion: activity?.descripcion || '',
    dia: activity?.dia ? new Date(activity.dia).toISOString().slice(0, 10) : '',
    hora: activity?.hora || '',
    horaFin: activity?.horaFin || '',
    responsable: activity?.responsable || '',
    lugar: activity?.lugar || '',
    esFija: Boolean(activity?.esFija),
  });

  useEffect(() => {
    setForm({
      nombre: activity?.nombre || '',
      descripcion: activity?.descripcion || '',
      dia: activity?.dia ? new Date(activity.dia).toISOString().slice(0, 10) : '',
      hora: activity?.hora || '',
      horaFin: activity?.horaFin || '',
      responsable: activity?.responsable || '',
      lugar: activity?.lugar || '',
      esFija: Boolean(activity?.esFija),
    });
  }, [activity]);

  const update = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.dia || !form.hora) return;
    onSubmit({
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      dia: form.dia,
      hora: form.hora,
      horaFin: form.horaFin || null,
      responsable: form.responsable.trim(),
      lugar: form.lugar.trim(),
      esFija: form.esFija,
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
          <label>Descripcion</label>
          <input value={form.descripcion} onChange={update('descripcion')} required />
        </div>
        <div className="field">
          <label>Dia</label>
          <input type="date" value={form.dia} onChange={update('dia')} required />
        </div>
        <div className="field">
          <label>Hora inicio</label>
          <input type="time" value={form.hora} onChange={update('hora')} required />
        </div>
        <div className="field">
          <label>Hora fin</label>
          <input type="time" value={form.horaFin} onChange={update('horaFin')} />
        </div>
        <div className="field">
          <label>Responsable</label>
          <input value={form.responsable} onChange={update('responsable')} />
        </div>
        <div className="field">
          <label>Lugar</label>
          <input value={form.lugar} onChange={update('lugar')} />
        </div>
        <label className="field inline-field">
          <input type="checkbox" checked={form.esFija} onChange={update('esFija')} />
          <span>Actividad fija</span>
        </label>
      </div>
      <div className="actions-row">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          Guardar actividad
        </button>
        <button className="btn" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export function ProfileSpacePage() {
  const { currentUser, loading: userLoading } = useCurrentUser();
  const [space, setSpace] = useState(null);
  const [spaceForm, setSpaceForm] = useState(null);
  const [activities, setActivities] = useState([]);
  const [editingSpace, setEditingSpace] = useState(false);
  const [activityModal, setActivityModal] = useState({ open: false, activity: null });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [deleteActivity, setDeleteActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isAgente = currentUser?.role === 'agente';

  const loadData = async () => {
    if (!currentUser?.idEspacio) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [spaceData, spaceActivities] = await Promise.all([
        espacioService.getEspacioById(currentUser.idEspacio),
        activitiesService.getActivitiesByEspacioId(currentUser.idEspacio),
      ]);
      const visibleActivities = (spaceActivities || []).filter(
        (item) => String(item.status || '').toLowerCase() !== 'rechazada',
      );
      setSpace(spaceData);
      setActivities(visibleActivities);
      setSpaceForm({
        nombre: spaceData?.nombre || '',
        telefono: spaceData?.telefono || '',
        tipoOrganizacion: spaceData?.tipoOrganizacion || 'comunitario',
        direccion: spaceData?.direccion || '',
        barrio: spaceData?.barrio || '',
        encargado: spaceData?.encargado || '',
        diasHorarios: spaceData?.diasHorarios || '',
        poblacionRaw: (spaceData?.poblacionVinculada || []).join(', '),
      });
    } catch (err) {
      setError(err.message || 'No se pudo cargar la institucion.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.idEspacio]);

  const updateSpaceField = (key) => (event) =>
    setSpaceForm((prev) => ({ ...prev, [key]: event.target.value }));

  const saveSpace = async () => {
    if (!space?.id || !spaceForm) return;
    setSaving(true);
    try {
      const payload = {
        nombre: spaceForm.nombre,
        telefono: spaceForm.telefono,
        tipoOrganizacion: spaceForm.tipoOrganizacion,
        direccion: spaceForm.direccion,
        barrio: spaceForm.barrio,
        encargado: spaceForm.encargado,
        diasHorarios: spaceForm.diasHorarios,
        poblacionVinculada: spaceForm.poblacionRaw
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
      };
      const updated = await espacioService.updateEspacio(space.id, payload);
      if (updated) setSpace(updated);
      setEditingSpace(false);
    } catch (err) {
      setError(err.message || 'No se pudo guardar la institucion.');
    } finally {
      setSaving(false);
    }
  };

  const saveActivity = async (payload) => {
    setSaving(true);
    try {
      if (activityModal.activity?.id) {
        await activitiesService.updateActivity(activityModal.activity.id, {
          ...payload,
          espacioId: currentUser.idEspacio,
        });
      } else {
        await activitiesService.createActivity({
          ...payload,
          espacioId: currentUser.idEspacio,
          isVerified: true,
        });
      }
      setActivityModal({ open: false, activity: null });
      await loadData();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la actividad.');
    } finally {
      setSaving(false);
    }
  };

  const removeActivity = async () => {
    if (!deleteActivity?.id) return;
    setSaving(true);
    setError('');
    try {
      await activitiesService.updateActivity(deleteActivity.id, { status: 'Rechazada' });
      setDeleteActivity(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar la actividad.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      title={isAgente ? 'Perfil espacio' : 'Mi institucion'}
      subtitle="Datos del espacio asociado al usuario logueado"
      actions={
        <>
          <button className="btn" type="button" onClick={loadData} disabled={loading || saving}>
            Actualizar
          </button>
          <button className="btn btn-primary" type="button" onClick={() => setEditingSpace((prev) => !prev)}>
            {editingSpace ? 'Bloquear' : 'Editar'}
          </button>
        </>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}
      {!currentUser?.idEspacio && !userLoading ? <p>El usuario no tiene institucion asociada.</p> : null}

      {spaceForm ? (
        <div className="grid">
          <div className="form-grid">
            <div className="field">
              <label>Nombre</label>
              <input value={spaceForm.nombre} onChange={updateSpaceField('nombre')} disabled={!editingSpace} />
            </div>
            <div className="field">
              <label>Telefono</label>
              <input value={spaceForm.telefono} onChange={updateSpaceField('telefono')} disabled={!editingSpace} />
            </div>
            <div className="field">
              <label>Tipo</label>
              <input
                value={spaceForm.tipoOrganizacion}
                onChange={updateSpaceField('tipoOrganizacion')}
                disabled={!editingSpace}
              />
            </div>
            <div className="field">
              <label>Direccion</label>
              <input value={spaceForm.direccion} onChange={updateSpaceField('direccion')} disabled={!editingSpace} />
            </div>
            <div className="field">
              <label>Barrio</label>
              <input value={spaceForm.barrio} onChange={updateSpaceField('barrio')} disabled={!editingSpace} />
            </div>
            <div className="field">
              <label>Encargado</label>
              <input value={spaceForm.encargado} onChange={updateSpaceField('encargado')} disabled={!editingSpace} />
            </div>
            <div className="field">
              <label>Dias y horarios</label>
              <input
                value={spaceForm.diasHorarios}
                onChange={updateSpaceField('diasHorarios')}
                disabled={!editingSpace}
              />
            </div>
            <div className="field">
              <label>Poblacion vinculada (coma separada)</label>
              <input
                value={spaceForm.poblacionRaw}
                onChange={updateSpaceField('poblacionRaw')}
                disabled={!editingSpace}
              />
            </div>
          </div>
          {editingSpace ? (
            <div className="actions-row">
              <button className="btn btn-primary" type="button" onClick={saveSpace} disabled={saving}>
                Guardar institucion
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {isAgente ? (
        <section className="section-block">
          <div className="section-header">
            <h3>Actividades del espacio</h3>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => setActivityModal({ open: true, activity: null })}
            >
              Nueva actividad
            </button>
          </div>
          <EntityTable
            columns={[
              { key: 'nombre', label: 'Nombre' },
              { key: 'dia', label: 'Fecha', render: (value) => formatShortDate(value) },
              { key: 'hora', label: 'Horario' },
              { key: 'responsable', label: 'Responsable' },
              { key: 'lugar', label: 'Lugar' },
            ]}
            rows={activities}
            actions={[
              { label: 'Ver', onClick: (row) => setSelectedActivity(row) },
              { label: 'Editar', onClick: (row) => setActivityModal({ open: true, activity: row }) },
              { label: 'Eliminar', className: 'btn-danger', onClick: (row) => setDeleteActivity(row) },
            ]}
          />
        </section>
      ) : null}

      <Modal
        open={activityModal.open}
        title={activityModal.activity ? 'Editar actividad' : 'Nueva actividad'}
        onClose={() => setActivityModal({ open: false, activity: null })}
      >
        <ActivityFormModal
          activity={activityModal.activity}
          onSubmit={saveActivity}
          onCancel={() => setActivityModal({ open: false, activity: null })}
          saving={saving}
        />
      </Modal>

      <Modal open={Boolean(selectedActivity)} title="Detalle de actividad" onClose={() => setSelectedActivity(null)}>
        {selectedActivity ? (
          <div className="grid">
            <p>
              <strong>Nombre:</strong> {selectedActivity.nombre}
            </p>
            <p>
              <strong>Descripcion:</strong> {selectedActivity.descripcion}
            </p>
            <p>
              <strong>Fecha:</strong> {formatDate(selectedActivity.dia)}
            </p>
            <p>
              <strong>Horario:</strong> {selectedActivity.hora}{' '}
              {selectedActivity.horaFin ? `- ${selectedActivity.horaFin}` : ''}
            </p>
            <p>
              <strong>Responsable:</strong> {selectedActivity.responsable}
            </p>
            <p>
              <strong>Lugar:</strong> {selectedActivity.lugar || '-'}
            </p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={Boolean(deleteActivity)}
        title="Eliminar actividad"
        onClose={() => setDeleteActivity(null)}
        actions={
          <>
            <button className="btn btn-danger" type="button" onClick={removeActivity} disabled={saving}>
              Eliminar
            </button>
            <button className="btn" type="button" onClick={() => setDeleteActivity(null)}>
              Cancelar
            </button>
          </>
        }
      >
        <p>
          Se eliminara la actividad <strong>{deleteActivity?.nombre}</strong>.
        </p>
      </Modal>

      {(loading || saving || userLoading) && <LoadingOverlay message="Cargando institucion..." />}
    </PageShell>
  );
}

function UserPickerModal({
  open,
  title,
  users,
  loading,
  search,
  onSearchChange,
  selectedUser,
  onSelect,
  onConfirm,
  onClose,
  confirmLabel,
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      actions={
        <>
          <button className="btn btn-primary" type="button" disabled={!selectedUser} onClick={onConfirm}>
            {confirmLabel}
          </button>
          <button className="btn" type="button" onClick={onClose}>
            Cancelar
          </button>
        </>
      }
    >
      <div className="grid">
        <input
          className="filter-input"
          placeholder="Buscar por nombre, alias o DNI"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        {loading ? <p>Cargando...</p> : null}
        {!loading && !users.length ? <p>No hay usuarios disponibles.</p> : null}
        <div className="list-picker">
          {users.map((user) => (
            <button
              key={user.id}
              type="button"
              className={`picker-item ${selectedUser?.id === user.id ? 'selected' : ''}`}
              onClick={() => onSelect(user)}
            >
              <strong>{user.nombre}</strong>
              <span>
                DNI: {user.dni || '-'} | Alias: {user.alias || '-'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export function EfectorPatientsPage() {
  const navigate = useNavigate();
  const { currentUser, loading: userLoading } = useCurrentUser();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerUsers, setPickerUsers] = useState([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerLoading, setPickerLoading] = useState(false);
  const [selectedPickerUser, setSelectedPickerUser] = useState(null);

  const loadPatients = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await efectorUsmyaService.getUsmyaUsersByEfectorId(currentUser.id);
      setPatients(data || []);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los pacientes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, [currentUser?.id]);

  const filtered = useMemo(() => {
    if (!search.trim()) return patients;
    const term = search.trim().toLowerCase();
    return patients.filter(
      (user) =>
        String(user.nombre || '').toLowerCase().includes(term) ||
        String(user.alias || '').toLowerCase().includes(term) ||
        String(user.dni || '').toLowerCase().includes(term),
    );
  }, [patients, search]);

  useEffect(() => {
    if (!pickerOpen || !currentUser?.id) return;
    setPickerLoading(true);
    usuarioService
      .searchAvailableUsmyaForEfector(pickerSearch, currentUser.id)
      .then((response) => setPickerUsers(response || []))
      .catch(() => setPickerUsers([]))
      .finally(() => setPickerLoading(false));
  }, [pickerOpen, pickerSearch, currentUser?.id]);

  const addPatient = async () => {
    if (!selectedPickerUser || !currentUser?.id) return;
    setLoading(true);
    setError('');
    try {
      await efectorUsmyaService.create({
        idEfector: currentUser.id,
        idUsmya: selectedPickerUser.id,
      });
      setPickerOpen(false);
      setSelectedPickerUser(null);
      setPickerSearch('');
      await loadPatients();
    } catch (err) {
      setError(err.message || 'No se pudo agregar el paciente.');
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Pacientes"
      subtitle="USMYA vinculados al efector actual"
      actions={
        <>
          <button className="btn btn-primary" type="button" onClick={() => setPickerOpen(true)}>
            Agregar existente
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate('/efector/pacientes/nuevo-paciente')}
          >
            Nuevo paciente
          </button>
          <button className="btn" type="button" onClick={loadPatients} disabled={loading}>
            Actualizar
          </button>
        </>
      }
    >
      <div className="actions-row">
        <input
          className="filter-input"
          placeholder="Buscar paciente"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <EntityTable
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'dni', label: 'DNI' },
          { key: 'telefono', label: 'Telefono' },
          { key: 'alias', label: 'Alias' },
        ]}
        rows={filtered}
        actions={[
          { label: 'Ver trayectoria', onClick: (row) => navigate(`/efector/pacientes/ver-trayectoria/${row.id}`) },
          { label: 'Ver ficha', onClick: (row) => navigate(`/efector/pacientes/ver-ficha/${row.id}`) },
        ]}
      />

      <UserPickerModal
        open={pickerOpen}
        title="Agregar paciente existente"
        users={pickerUsers}
        loading={pickerLoading}
        search={pickerSearch}
        onSearchChange={setPickerSearch}
        selectedUser={selectedPickerUser}
        onSelect={setSelectedPickerUser}
        onConfirm={addPatient}
        onClose={() => {
          setPickerOpen(false);
          setSelectedPickerUser(null);
          setPickerSearch('');
        }}
        confirmLabel="Agregar paciente"
      />

      {(loading || userLoading) && <LoadingOverlay message="Cargando pacientes..." />}
    </PageShell>
  );
}

export function ReferenteCompanionsPage() {
  const navigate = useNavigate();
  const { currentUser, loading: userLoading } = useCurrentUser();
  const [companions, setCompanions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerUsers, setPickerUsers] = useState([]);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerLoading, setPickerLoading] = useState(false);
  const [selectedPickerUser, setSelectedPickerUser] = useState(null);

  const loadCompanions = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const links = await referenteUsmyaService.getByIdReferente(currentUser.id);
      const users = await Promise.all((links || []).map((link) => usuarioService.getUserById(link.idUsmya)));
      setCompanions(users.filter(Boolean));
    } catch (err) {
      setError(err.message || 'No se pudieron cargar los acompaÃ±ados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanions();
  }, [currentUser?.id]);

  const filtered = useMemo(() => {
    if (!search.trim()) return companions;
    const term = search.trim().toLowerCase();
    return companions.filter(
      (user) =>
        String(user.nombre || '').toLowerCase().includes(term) ||
        String(user.alias || '').toLowerCase().includes(term) ||
        String(user.dni || '').toLowerCase().includes(term),
    );
  }, [companions, search]);

  useEffect(() => {
    if (!pickerOpen || !currentUser?.id) return;
    setPickerLoading(true);
    usuarioService
      .searchAvailableUsmya(pickerSearch, currentUser.id)
      .then((response) => setPickerUsers(response || []))
      .catch(() => setPickerUsers([]))
      .finally(() => setPickerLoading(false));
  }, [pickerOpen, pickerSearch, currentUser?.id]);

  const addCompanion = async () => {
    if (!selectedPickerUser || !currentUser?.id) return;
    setLoading(true);
    setError('');
    try {
      await referenteUsmyaService.create({
        idReferente: currentUser.id,
        idUsmya: selectedPickerUser.id,
      });
      setPickerOpen(false);
      setSelectedPickerUser(null);
      setPickerSearch('');
      await loadCompanions();
    } catch (err) {
      setError(err.message || 'No se pudo agregar el acompanado.');
      setLoading(false);
    }
  };

  return (
    <PageShell
      title="Mis acompanados"
      subtitle="USMYA vinculados al referente actual"
      actions={
        <>
          <button className="btn btn-primary" type="button" onClick={() => setPickerOpen(true)}>
            Agregar acompanado
          </button>
          <button className="btn" type="button" onClick={loadCompanions} disabled={loading}>
            Actualizar
          </button>
        </>
      }
    >
      <div className="actions-row">
        <input
          className="filter-input"
          placeholder="Buscar acompanado"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>
      {error ? <p className="error-text">{error}</p> : null}
      <EntityTable
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'dni', label: 'DNI' },
          { key: 'telefono', label: 'Telefono' },
          { key: 'alias', label: 'Alias' },
        ]}
        rows={filtered}
        actions={[
          {
            label: 'Ver trayectoria',
            onClick: (row) => navigate(`/referente/mis-acompanados/ver-trayectoria/${row.id}`),
          },
          { label: 'Ver ficha', onClick: (row) => navigate(`/referente/mis-acompanados/ver-ficha/${row.id}`) },
        ]}
      />

      <UserPickerModal
        open={pickerOpen}
        title="Agregar acompanado"
        users={pickerUsers}
        loading={pickerLoading}
        search={pickerSearch}
        onSearchChange={setPickerSearch}
        selectedUser={selectedPickerUser}
        onSelect={setSelectedPickerUser}
        onConfirm={addCompanion}
        onClose={() => {
          setPickerOpen(false);
          setSelectedPickerUser(null);
          setPickerSearch('');
        }}
        confirmLabel="Agregar acompanado"
      />

      {(loading || userLoading) && <LoadingOverlay message="Cargando acompaÃ±ados..." />}
    </PageShell>
  );
}

export function UsmyaProfilePage() {
  const { currentUser, loading: userLoading } = useCurrentUser();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('datos');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await usuarioService.getUserById(currentUser.id);
      setUser(response);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentUser?.id]);

  const savePatch = async (patch) => {
    if (!user?.id) return;
    setSaving(true);
    setError('');
    try {
      const updated = await usuarioService.updateUser(user.id, patch);
      if (updated) setUser(updated);
    } catch (err) {
      setError(err.message || 'No se pudo guardar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell title="Mi perfil" subtitle="Datos personales y resumen">
      {error ? <p className="error-text">{error}</p> : null}
      <UserTabs
        tabs={[
          { key: 'datos', label: 'Datos personales' },
          { key: 'resumen', label: 'Resumen' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'datos' && user ? (
        <PersonalDataForm initialValue={user} onSave={savePatch} disabled={saving} />
      ) : null}
      {activeTab === 'resumen' && user ? (
        <SummaryEditor
          initialValue={user.summary || summaryDefaults}
          onSave={(summary) => savePatch({ summary })}
          disabled={saving}
        />
      ) : null}

      {(loading || saving || userLoading) && <LoadingOverlay message="Cargando perfil..." />}
    </PageShell>
  );
}

