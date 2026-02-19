import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import { useCurrentUser } from '../hooks/useCurrentUser';
import {
  activitiesService,
  asistenciaService,
  espacioService,
  notasTrayectoriaService,
  usuarioService,
} from '../services';
import { formatDateTimeLabel, roleLabel } from '../utils/formatters';

function TrajectoryTimeline({ usmyaId, title, subtitle, canCreateNotes }) {
  const { currentUser } = useCurrentUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [detail, setDetail] = useState(null);
  const [newNoteOpen, setNewNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState({ titulo: '', observacion: '' });
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    if (!usmyaId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [assistances, notes, activities, spaces, users] = await Promise.all([
        asistenciaService.getAsistenciasByUsmyaId(usmyaId),
        notasTrayectoriaService.getNotasByIdUsmya(usmyaId),
        activitiesService.getAllActivities(),
        espacioService.getAllEspacios(),
        usuarioService.getAllUsers(),
      ]);

      const activityMap = new Map((activities || []).map((item) => [Number(item.id), item]));
      const spaceMap = new Map((spaces || []).map((item) => [Number(item.id), item]));
      const usersMap = new Map((users || []).map((item) => [Number(item.id), item]));

      const assistanceItems = (assistances || []).map((assistance) => {
        const activity = activityMap.get(Number(assistance.idActividad));
        const space = activity ? spaceMap.get(Number(activity.espacioId)) : null;
        const eventDate = activity?.dia || new Date().toISOString();
        return {
          id: `as-${assistance.id}`,
          type: 'asistencia',
          date: eventDate,
          title: activity?.nombre || `Actividad ${assistance.idActividad}`,
          subtitle: formatDateTimeLabel(eventDate, activity?.hora),
          description: assistance.observacion || '',
          extra: `${space?.nombre || 'Espacio'} Â· Estado: ${assistance.estado}`,
        };
      });

      const notesItems = (notes || []).map((note) => {
        const actor = usersMap.get(Number(note.idActor));
        return {
          id: `note-${note.id}`,
          type: 'nota',
          date: note.fecha,
          title: note.titulo,
          subtitle: formatDateTimeLabel(note.fecha, note.hora),
          description: note.observacion,
          extra: `${actor?.nombre || 'Profesional'} Â· ${roleLabel[actor?.role] || actor?.role || ''}`,
        };
      });

      const merged = [...assistanceItems, ...notesItems].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      setItems(merged);
    } catch (err) {
      setError(err.message || 'No se pudo cargar la trayectoria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [usmyaId]);

  const saveNote = async () => {
    if (!newNote.titulo.trim() || !newNote.observacion.trim() || !currentUser?.id) return;
    setSaving(true);
    setError('');
    try {
      const now = new Date();
      await notasTrayectoriaService.create({
        idActor: currentUser.id,
        idUsmya: Number(usmyaId),
        titulo: newNote.titulo.trim(),
        observacion: newNote.observacion.trim(),
        fecha: `${now.toISOString().slice(0, 10)}T00:00:00.000Z`,
        hora: now.toTimeString().slice(0, 5),
      });
      setNewNote({ titulo: '', observacion: '' });
      setNewNoteOpen(false);
      await loadData();
    } catch (err) {
      setError(err.message || 'No se pudo guardar la observacion.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      title={title}
      subtitle={subtitle}
      actions={
        canCreateNotes ? (
          <button className="btn btn-primary" type="button" onClick={() => setNewNoteOpen(true)}>
            Nueva observacion
          </button>
        ) : null
      }
    >
      {error ? <p className="error-text">{error}</p> : null}
      {!items.length && !loading ? <p>No hay registros de trayectoria.</p> : null}
      <ul className="timeline">
        {items.map((item) => (
          <li key={item.id}>
            <button className="btn btn-link timeline-button" type="button" onClick={() => setDetail(item)}>
              <strong>{item.title}</strong>
              <div className="page-meta">{item.subtitle}</div>
              <div>{item.extra}</div>
            </button>
          </li>
        ))}
      </ul>

      <Modal open={Boolean(detail)} title="Detalle de trayectoria" onClose={() => setDetail(null)}>
        {detail ? (
          <div className="grid">
            <p>
              <strong>Tipo:</strong> {detail.type}
            </p>
            <p>
              <strong>Titulo:</strong> {detail.title}
            </p>
            <p>
              <strong>Fecha:</strong> {detail.subtitle}
            </p>
            <p>
              <strong>Detalle:</strong> {detail.description || '-'}
            </p>
            <p>
              <strong>Meta:</strong> {detail.extra}
            </p>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={newNoteOpen}
        title="Nueva observacion de trayectoria"
        onClose={() => setNewNoteOpen(false)}
        actions={
          <>
            <button className="btn btn-primary" type="button" onClick={saveNote} disabled={saving}>
              Guardar
            </button>
            <button className="btn" type="button" onClick={() => setNewNoteOpen(false)}>
              Cancelar
            </button>
          </>
        }
      >
        <div className="grid">
          <div className="field">
            <label>Titulo</label>
            <input
              value={newNote.titulo}
              onChange={(event) => setNewNote((prev) => ({ ...prev, titulo: event.target.value }))}
            />
          </div>
          <div className="field">
            <label>Observacion</label>
            <textarea
              rows={5}
              value={newNote.observacion}
              onChange={(event) => setNewNote((prev) => ({ ...prev, observacion: event.target.value }))}
            />
          </div>
        </div>
      </Modal>

      {(loading || saving) && <LoadingOverlay message="Cargando trayectoria..." />}
    </PageShell>
  );
}

export function PatientPathPage() {
  const { id } = useParams();
  const { currentUser } = useCurrentUser();
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    usuarioService.getUserById(id).then(setTargetUser).catch(() => setTargetUser(null));
  }, [id]);

  return (
    <TrajectoryTimeline
      usmyaId={id}
      title={targetUser ? `Trayectoria de ${targetUser.nombre}` : 'Trayectoria del paciente'}
      subtitle="Evolucion, asistencias y observaciones"
      canCreateNotes={currentUser?.role === 'efector' || currentUser?.role === 'referente'}
    />
  );
}

export function AccompaniedPathPage() {
  const { id } = useParams();
  const { currentUser } = useCurrentUser();
  const [targetUser, setTargetUser] = useState(null);

  useEffect(() => {
    usuarioService.getUserById(id).then(setTargetUser).catch(() => setTargetUser(null));
  }, [id]);

  return (
    <TrajectoryTimeline
      usmyaId={id}
      title={targetUser ? `Trayectoria de ${targetUser.nombre}` : 'Trayectoria del acompanado'}
      subtitle="Evolucion, asistencias y observaciones"
      canCreateNotes={currentUser?.role === 'efector' || currentUser?.role === 'referente'}
    />
  );
}

export function UsmyaPathPage() {
  const { currentUser } = useCurrentUser();

  return (
    <TrajectoryTimeline
      usmyaId={currentUser?.id}
      title="Mi trayectoria"
      subtitle="Historial de asistencias y notas de seguimiento"
      canCreateNotes={false}
    />
  );
}

