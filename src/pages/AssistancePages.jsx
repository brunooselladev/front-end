import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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

// ─── Asistencias list ────────────────────────────────────────────────────────

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
        if (mounted) { setRows([]); setLoading(false); }
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
          }),
        );
        if (mounted) setRows(rowsData);
      } catch (err) {
        if (mounted) setError(err.message || 'No se pudieron cargar las asistencias.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadData();
    return () => { mounted = false; };
  }, [currentUser]);

  const rolePrefix = currentUser?.role === 'efector' ? '/efector' : '/agente';

  return (
    <PageShell title="Asistencias">
      {error ? <p className="error-text">{error}</p> : null}
      {!currentUser?.idEspacio && !userLoading ? (
        <p>No hay <code>idEspacio</code> configurado para este usuario.</p>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
        {rows.map((row) => (
          <ActivityCard
            key={row.id}
            activityName={row.activityName}
            activityDate={row.activityDate}
            activityTime={row.activityTime}
            participantCount={row.confirmedParticipants}
            onViewDetails={() => navigate(`${rolePrefix}/asistencia/detalles/${row.id}`)}
          />
        ))}
        {!loading && !userLoading && rows.length === 0 && (
          <p style={{ color: '#888' }}>No hay actividades registradas.</p>
        )}
      </div>

      {(loading || userLoading) && <LoadingOverlay message="Cargando asistencias..." />}
    </PageShell>
  );
}

function ActivityCard({ activityName, activityDate, activityTime, participantCount, onViewDetails }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: '17px', marginBottom: '6px', color: '#111' }}>
          {activityName}
        </div>
        <div style={{ display: 'flex', gap: '20px', color: '#555', fontSize: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CalendarIcon />
            {activityDate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ClockIcon />
            {activityTime}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#555', fontSize: '14px', whiteSpace: 'nowrap' }}>
          <PeopleIcon />
          {participantCount} participantes anotados
        </span>
        <button
          type="button"
          onClick={onViewDetails}
          style={{
            background: '#4f6ef7',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '9px 18px',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          Ver detalles <ChevronIcon />
        </button>
      </div>
    </div>
  );
}

// ─── Asistencia details ──────────────────────────────────────────────────────

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

  useEffect(() => { loadData(); }, [id]);

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
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(`${rolePrefix}/asistencia`)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#4f6ef7', fontWeight: 600, fontSize: '15px', marginBottom: '20px', padding: 0,
        }}
      >
        ‹ Detalles de la asistencia
      </button>

      {error ? <p style={{ color: '#e53e3e' }}>{error}</p> : null}

      {/* Activity info card */}
      {activity && (
        <div style={{
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px',
          padding: '24px', marginBottom: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>{activity.nombre}</h2>
            {activity.tipo && (
              <span style={{
                background: '#eef2ff', color: '#4f6ef7', borderRadius: '6px',
                padding: '3px 10px', fontSize: '13px', fontWeight: 600,
              }}>{activity.tipo}</span>
            )}
          </div>
          {activity.descripcion && (
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px', marginTop: '4px' }}>
              {activity.descripcion}
            </p>
          )}

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px', marginTop: '8px',
          }}>
            <InfoChip icon={<CalendarIcon color="#4f6ef7" />} label="FECHA" value={formatDate(activity.dia)} color="#eef2ff" />
            <InfoChip icon={<ClockIcon color="#16a34a" />} label="HORARIO" value={`${activity.hora}${activity.horaFin ? ` - ${activity.horaFin}` : ''}`} color="#f0fdf4" />
            {activity.responsable && (
              <InfoChip icon={<PersonIcon color="#9333ea" />} label="RESPONSABLE" value={activity.responsable} color="#faf5ff" />
            )}
            {activity.lugar && (
              <InfoChip icon={<PinIcon color="#ea580c" />} label="LUGAR" value={activity.lugar} color="#fff7ed" />
            )}
          </div>
        </div>
      )}

      {/* Participants */}
      <div style={{
        background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px',
        padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700 }}>Participantes</h3>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4f6ef7', fontSize: '14px', fontWeight: 600 }}>
            <PeopleIcon color="#4f6ef7" /> {assistances.length} registrados
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {assistances.map((asistencia) => {
            const user = usersMap.get(Number(asistencia.idUser));
            const isPresente = asistencia.estado === 'presente';
            return (
              <ParticipantCard
                key={asistencia.id}
                nombre={user?.nombre || `Usuario ${asistencia.idUser}`}
                dni={user?.dni}
                estado={asistencia.estado}
                observacion={asistencia.observacion}
                onPresente={() => updateStatus(asistencia, 'presente')}
                onAusente={() => updateStatus(asistencia, 'ausente')}
                onVerFicha={() => {
                  if (currentUser?.role === 'efector') navigate(`/efector/pacientes/ver-ficha/${asistencia.idUser}`);
                  else navigate(`/agente/asistencia/ver-ficha/${asistencia.idUser}`);
                }}
              />
            );
          })}
          {!loading && assistances.length === 0 && (
            <p style={{ color: '#888', textAlign: 'center', padding: '20px 0' }}>
              No hay participantes registrados.
            </p>
          )}
        </div>
      </div>

      {(loading || working) && <LoadingOverlay message="Procesando asistencias..." />}
    </div>
  );
}

function ParticipantCard({ nombre, dni, estado, observacion, onPresente, onAusente, onVerFicha }) {
  const isPresente = estado === 'presente';
  const isAusente = estado === 'ausente';

  return (
    <div style={{
      border: '1px solid #e5e7eb', borderRadius: '12px',
      padding: '16px 20px', background: '#fafafa',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        {/* Left: avatar + name + DNI */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '50%',
            background: '#4f6ef7', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
          }}>
            <PersonIcon color="#fff" size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{nombre}</div>
            {dni && (
              <div style={{ color: '#666', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FolderIcon /> DNI: {dni}
              </div>
            )}
          </div>
        </div>

        {/* Right: badge + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {estado && (
            <span style={{
              background: isPresente ? '#dcfce7' : isAusente ? '#fef9c3' : '#f3f4f6',
              color: isPresente ? '#16a34a' : isAusente ? '#a16207' : '#555',
              borderRadius: '999px', padding: '4px 12px',
              fontSize: '13px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}>
              {isPresente && '✓ '}Presente{isAusente ? '' : ''}
              {estado}
            </span>
          )}
          <button type="button" onClick={onPresente} style={actionBtnStyle('#4f6ef7', '#fff')}>Presente</button>
          <button type="button" onClick={onAusente} style={actionBtnStyle('#fff', '#555', '#e5e7eb')}>Ausente</button>
          <button type="button" onClick={onVerFicha} style={actionBtnStyle('#fff', '#4f6ef7', '#c7d2fe')}>Ver ficha</button>
        </div>
      </div>

      {/* Observation */}
      {observacion && (
        <div style={{ marginTop: '10px', color: '#555', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <CommentIcon />
          {observacion}
        </div>
      )}
    </div>
  );
}

function InfoChip({ icon, label, value, color }) {
  return (
    <div style={{ background: color || '#f9fafb', borderRadius: '10px', padding: '12px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#888', fontSize: '11px', fontWeight: 700, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {icon} {label}
      </div>
      <div style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{value}</div>
    </div>
  );
}

const actionBtnStyle = (bg, color, border) => ({
  background: bg,
  color,
  border: `1px solid ${border || bg}`,
  borderRadius: '7px',
  padding: '6px 14px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
});

// ─── Tiny SVG icons ──────────────────────────────────────────────────────────

const CalendarIcon = ({ color = '#4f6ef7' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const ClockIcon = ({ color = '#16a34a' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const PeopleIcon = ({ color = '#555' }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const PersonIcon = ({ color = '#555', size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const PinIcon = ({ color = '#ea580c' }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const FolderIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);
const CommentIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

// ─── ParticipantFormPage (unchanged) ─────────────────────────────────────────

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

  useEffect(() => { loadData(); }, [id]);

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