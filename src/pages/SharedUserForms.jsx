import React, { useEffect, useState } from 'react';
import { activitiesService, tagsService } from '../services';
import { formatDate } from '../utils/formatters';

export const summaryDefaults = {
  necesidades: { text: '', tags: [] },
  deseos: { text: '', tags: [] },
  demandas: { text: '', tags: [] },
  intereses: { text: '', tags: [] },
};

export function resolveBackPath(pathname) {
  if (pathname.startsWith('/agente/asistencia/ver-ficha')) return '/agente/asistencia';
  if (pathname.startsWith('/efector/pacientes/ver-ficha')) return '/efector/pacientes';
  if (pathname.startsWith('/referente/mis-acompanados/ver-ficha')) return '/referente/mis-acompanados';
  return '/';
}

export function PersonalDataForm({ initialValue, onSave, disabled }) {
  const [form, setForm] = useState({
    nombre: initialValue?.nombre || '',
    email: initialValue?.email || '',
    dni: initialValue?.dni || '',
    fechaNacimiento: initialValue?.fechaNacimiento || '',
    telefono: initialValue?.telefono || '',
    direccionResidencia: initialValue?.direccionResidencia || '',
    alias: initialValue?.alias || '',
    generoAutoPercibido: initialValue?.generoAutoPercibido || '',
    estadoCivil: initialValue?.estadoCivil || '',
    obraSocial: initialValue?.obraSocial || '',
  });

  useEffect(() => {
    setForm({
      nombre: initialValue?.nombre || '',
      email: initialValue?.email || '',
      dni: initialValue?.dni || '',
      fechaNacimiento: initialValue?.fechaNacimiento
        ? new Date(initialValue.fechaNacimiento).toISOString().slice(0, 10)
        : '',
      telefono: initialValue?.telefono || '',
      direccionResidencia: initialValue?.direccionResidencia || '',
      alias: initialValue?.alias || '',
      generoAutoPercibido: initialValue?.generoAutoPercibido || '',
      estadoCivil: initialValue?.estadoCivil || '',
      obraSocial: initialValue?.obraSocial || '',
    });
  }, [initialValue]);

  const update = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();
    if (!form.nombre.trim()) return;

    onSave({
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      dni: form.dni ? Number(form.dni) : null,
      fechaNacimiento: form.fechaNacimiento || null,
      telefono: form.telefono.trim() || null,
      direccionResidencia: form.direccionResidencia.trim() || null,
      alias: form.alias.trim() || null,
      generoAutoPercibido: form.generoAutoPercibido.trim() || null,
      estadoCivil: form.estadoCivil.trim() || null,
      obraSocial: form.obraSocial.trim() || null,
    });
  };

  return (
    <form className="grid" onSubmit={submit}>
      <div className="form-grid">
        <div className="field">
          <label>Nombre</label>
          <input value={form.nombre} onChange={update('nombre')} disabled={disabled} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input value={form.email} onChange={update('email')} disabled={disabled} />
        </div>
        <div className="field">
          <label>DNI</label>
          <input value={form.dni} onChange={update('dni')} disabled={disabled} />
        </div>
        <div className="field">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            value={form.fechaNacimiento}
            onChange={update('fechaNacimiento')}
            disabled={disabled}
          />
        </div>
        <div className="field">
          <label>Telefono</label>
          <input value={form.telefono} onChange={update('telefono')} disabled={disabled} />
        </div>
        <div className="field">
          <label>Direccion</label>
          <input
            value={form.direccionResidencia}
            onChange={update('direccionResidencia')}
            disabled={disabled}
          />
        </div>
        <div className="field">
          <label>Alias</label>
          <input value={form.alias} onChange={update('alias')} disabled={disabled} />
        </div>
        <div className="field">
          <label>Genero autopercibido</label>
          <input
            value={form.generoAutoPercibido}
            onChange={update('generoAutoPercibido')}
            disabled={disabled}
          />
        </div>
        <div className="field">
          <label>Estado civil</label>
          <input value={form.estadoCivil} onChange={update('estadoCivil')} disabled={disabled} />
        </div>
        <div className="field">
          <label>Obra social</label>
          <input value={form.obraSocial} onChange={update('obraSocial')} disabled={disabled} />
        </div>
      </div>

      {!disabled ? (
        <div className="actions-row">
          <button className="btn btn-primary" type="submit">
            Guardar cambios
          </button>
        </div>
      ) : null}
    </form>
  );
}

export function SummaryEditor({ initialValue, onSave, disabled }) {
  const [tags, setTags] = useState([]);
  const [form, setForm] = useState(summaryDefaults);

  useEffect(() => {
    let mounted = true;

    tagsService
      .getAllTags()
      .then((response) => {
        if (mounted) setTags(response || []);
      })
      .catch(() => {
        if (mounted) setTags([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const summary = initialValue || summaryDefaults;
    setForm({
      necesidades: {
        text: summary.necesidades?.text || '',
        tags: summary.necesidades?.tags || [],
      },
      deseos: {
        text: summary.deseos?.text || '',
        tags: summary.deseos?.tags || [],
      },
      demandas: {
        text: summary.demandas?.text || '',
        tags: summary.demandas?.tags || [],
      },
      intereses: {
        text: summary.intereses?.text || '',
        tags: summary.intereses?.tags || [],
      },
    });
  }, [initialValue]);

  const setText = (section) => (event) =>
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        text: event.target.value,
      },
    }));

  const toggleTag = (section, tagId) => () => {
    if (disabled) return;
    setForm((prev) => {
      const current = prev[section].tags || [];
      const next = current.includes(tagId)
        ? current.filter((item) => item !== tagId)
        : [...current, tagId];
      return {
        ...prev,
        [section]: {
          ...prev[section],
          tags: next,
        },
      };
    });
  };

  const submit = (event) => {
    event.preventDefault();
    if (disabled) return;
    onSave(form);
  };

  const sections = [
    { key: 'necesidades', label: 'Necesidades' },
    { key: 'deseos', label: 'Deseos' },
    { key: 'demandas', label: 'Demandas' },
    { key: 'intereses', label: 'Intereses' },
  ];

  return (
    <form className="grid" onSubmit={submit}>
      <div className="grid grid-2">
        {sections.map((section) => (
          <article className="card" key={section.key}>
            <h3>{section.label}</h3>
            <div className="field">
              <textarea
                rows={4}
                value={form[section.key].text}
                onChange={setText(section.key)}
                disabled={disabled}
              />
            </div>
            <div className="tag-grid">
              {tags.map((tag) => {
                const selected = form[section.key].tags.includes(tag.id);
                return (
                  <button
                    key={`${section.key}-${tag.id}`}
                    type="button"
                    className={`tag-chip ${selected ? 'selected' : ''}`}
                    onClick={toggleTag(section.key, tag.id)}
                    disabled={disabled}
                  >
                    {tag.nombre}
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      {!disabled ? (
        <div className="actions-row">
          <button className="btn btn-primary" type="submit">
            Guardar resumen
          </button>
        </div>
      ) : null}
    </form>
  );
}

export function ActivitiesEditor({ selectedIds = [], onSave, disabled }) {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(selectedIds || []);

  useEffect(() => {
    let mounted = true;
    activitiesService
      .getAllActivities()
      .then((response) => {
        if (mounted) setActivities(response || []);
      })
      .catch(() => {
        if (mounted) setActivities([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setSelected(selectedIds || []);
  }, [selectedIds]);

  const toggle = (activityId) => () => {
    if (disabled) return;
    setSelected((prev) =>
      prev.includes(activityId) ? prev.filter((item) => item !== activityId) : [...prev, activityId],
    );
  };

  return (
    <div className="grid">
      <div className="grid grid-2">
        {activities.map((activity) => {
          const isSelected = selected.includes(activity.id);
          return (
            <article className={`card selectable ${isSelected ? 'selected' : ''}`} key={activity.id}>
              <h3>{activity.nombre}</h3>
              <p className="page-meta">
                {formatDate(activity.dia)} - {activity.hora}
              </p>
              <p>{activity.descripcion}</p>
              <button className="btn" type="button" onClick={toggle(activity.id)} disabled={disabled}>
                {isSelected ? 'Quitar' : 'Seleccionar'}
              </button>
            </article>
          );
        })}
      </div>
      {!disabled ? (
        <div className="actions-row">
          <button className="btn btn-primary" type="button" onClick={() => onSave(selected)}>
            Guardar actividades
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function UserTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="actions-row tab-row">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`btn ${activeTab === tab.key ? 'btn-primary' : ''}`}
          type="button"
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

