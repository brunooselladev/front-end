import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EntityTable from '../components/EntityTable';
import LoadingOverlay from '../components/LoadingOverlay';
import PageShell from '../components/PageShell';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { activitiesService, asistenciaService, usuarioService } from '../services';
import { formatDate, formatShortDate } from '../utils/formatters';
import {
  ActivitiesEditor,
  PersonalDataForm,
  resolveBackPath,
  SummaryEditor,
  summaryDefaults,
  UserTabs,
} from './SharedUserForms';

export function AssistancePage() {
  const navigate = useNavigate();
  const { currentUser, loading: userLoading } = useCurrentUser();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!currentUser?.idEspacio) {
        if (mounted) {
          setRows([]);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError('');
      try {
        const activities = await activitiesService.getActivitiesByEspacioId(currentUser.idEspacio);
        const rowsData = await Promise.all(
          (activities || []).map(async (activity) => {
            const assistances = await asistenciaService.getAsistenciasByActividadId(activity.id);
            return {
              id: activity.id,
              activityName: activity.nombre,
              activityDate: formatShortDate(activity.dia),
              activityTime: `${activity.hora}${activity.horaFin ? ` - ${activity.horaFin}` : ''}`,
              confirmedParticipants: (assistances || []).length,
            };
          })
        );
        if (mounted) setRows(rowsData);
      } catch (err) {
        if (mounted) setError(err.message || 'No se pudieron cargar las asistencias.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  const rolePrefix = currentUser?.role === 'efector' ? '/efector' : '/agente';

  return (
    <PageShell title="Asistencias" subtitle="Actividades del espacio y participantes confirmados">
      {error ? <p className="error-text">{error}</p> : null}
      {!currentUser?.idEspacio && !userLoading ? (
        <p>No hay `idEspacio` configurado para este usuario.</p>
      ) : null}
      <EntityTable
        columns={[
          { key: 'activityName', label: 'Actividad' },
          { key: 'activityDate', label: 'Fecha' },
          { key: 'activityTime', label: 'Horario' },
          { key: 'confirmedParticipants', label: 'Participantes' },
        ]}
        rows={rows}
        actions={[
          {
            label: 'Ver detalle',
            onClick: (row) => navigate(`${rolePrefix}/asistencia/detalles/${row.id}`),
          },
        ]}
      />
      {(loading || userLoading) && <LoadingOverlay message="Cargando asistencias..." />}
    </PageShell>
  );
}

export function AssistanceDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useCurrentUser();
  const [activity, setActivity] = useState(null);
  const [assistances, setAssistances] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  const usersMap = useMemo(() => {
    const map = new Map();
    users.forEach((user) => map.set(Number(user.id), user));
    return map;
  }, [users]);

  const rolePrefix = currentUser?.role === 'efector' ? '/efector' : '/agente';

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [activityData, assistancesData, allUsers] = await Promise.all([
        activitiesService.getActivityById(id),
        asistenciaService.getAsistenciasByActividadId(id),
        usuarioService.getAllUsers(),
      ]);
      setActivity(activityData);
      setAssistances(assistancesData || []);
      setUsers(allUsers || []);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el detalle de asistencias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const updateStatus = async (row, status) => {
    setWorking(true);
    setError('');
    try {
      await asistenciaService.updateAsistencia(row.id, { estado: status });
      await loadData();
    } catch (err) {
      setError(err.message || 'No se pudo actualizar el estado.');
    } finally {
      setWorking(false);
    }
  };

  return (
    <PageShell
      title={activity ? `Detalle: ${activity.nombre}` : 'Detalle de asistencia'}
      subtitle={activity ? `${formatDate(activity.dia)} - ${activity.hora}` : 'Gestion de participantes'}
      actions={
        <button className="btn" type="button" onClick={() => navigate(`${rolePrefix}/asistencia`)}>
          Volver
        </button>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}

      <EntityTable
        columns={[
          {
            key: 'idUser',
            label: 'Participante',
            render: (value) => usersMap.get(Number(value))?.nombre || `Usuario ${value}`,
          },
          {
            key: 'estado',
            label: 'Estado',
            render: (value) => (
              <span className={`badge ${value === 'presente' ? 'ok' : 'pending'}`}>{value}</span>
            ),
          },
          { key: 'observacion', label: 'Observacion' },
        ]}
        rows={assistances}
        actions={[
          {
            label: 'Presente',
            className: 'btn-primary',
            onClick: (row) => updateStatus(row, 'presente'),
          },
          {
            label: 'Ausente',
            className: 'btn-warning',
            onClick: (row) => updateStatus(row, 'ausente'),
          },
          {
            label: 'Ver ficha',
            onClick: (row) => {
              if (currentUser?.role === 'efector') navigate(`/efector/pacientes/ver-ficha/${row.idUser}`);
              else navigate(`/agente/asistencia/ver-ficha/${row.idUser}`);
            },
          },
        ]}
      />

      {(loading || working) && <LoadingOverlay message="Procesando asistencias..." />}
    </PageShell>
  );
}

export function ParticipantFormPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('datos');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await usuarioService.getUserById(id);
      setUser(response);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la ficha del participante.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const savePatch = async (patch) => {
    if (!user?.id) return;
    setSaving(true);
    setError('');
    try {
      const updated = await usuarioService.updateUser(user.id, patch);
      if (updated) setUser(updated);
    } catch (err) {
      setError(err.message || 'No se pudo guardar la ficha.');
    } finally {
      setSaving(false);
    }
  };

  const backPath = resolveBackPath(location.pathname);

  return (
    <PageShell
      title={user ? `Ficha de ${user.nombre}` : 'Ficha de participante'}
      subtitle="Consulta y actualizacion de datos"
      actions={
        <button className="btn" type="button" onClick={() => navigate(backPath)}>
          Volver
        </button>
      }
    >
      {error ? <p className="error-text">{error}</p> : null}
      <UserTabs
        tabs={[
          { key: 'datos', label: 'Datos personales' },
          { key: 'resumen', label: 'Resumen' },
          { key: 'actividades', label: 'Actividades' },
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
      {activeTab === 'actividades' && user ? (
        <ActivitiesEditor
          selectedIds={user.recommendedActivities || []}
          onSave={(recommendedActivities) => savePatch({ recommendedActivities })}
          disabled={saving}
        />
      ) : null}

      {(loading || saving) && <LoadingOverlay message="Cargando ficha..." />}
    </PageShell>
  );
}

