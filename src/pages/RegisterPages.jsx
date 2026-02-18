import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';
import { espacioService, registerService } from '../services';

function RegisterWrapper({ title, subtitle, children }) {
  return (
    <div className="auth-screen">
      <div className="auth-screen__background">
        <div className="auth-shape auth-shape--one" />
        <div className="auth-shape auth-shape--two" />
        <div className="auth-shape auth-shape--three" />
      </div>

      <div className="auth-logo-corner" aria-hidden="true">
        <img src="/assets/logo-arguello.png" alt="Logo Arguello" />
      </div>

      <div className="auth-shell auth-shell--register">
        <div className="auth-branding">
          <h1>MappA</h1>
          <div className="auth-branding__line" />
          <p>Red Comunitaria</p>
        </div>

        <section className="auth-card auth-card--register">
          <div className="auth-card__glow" />
          <div className="auth-card__content">
            <header className="auth-card__header">
              <Link className="auth-back-link" to="/login">
                Volver
              </Link>
              <h2>{title}</h2>
              {subtitle ? <p>{subtitle}</p> : null}
            </header>
            {children}
          </div>
          <div className="auth-card__bar" />
        </section>

        <p className="auth-footer">Conectando comunidades - Construyendo futuro</p>
      </div>
    </div>
  );
}

function useSpaceOptions() {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    let mounted = true;
    espacioService.getAllEspacios().then((data) => {
      if (mounted) setOptions(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return options;
}

function BasicPersonForm({ onSubmit, includeSpace = false, includeProfessional = false, includePassword = true }) {
  const navigate = useNavigate();
  const spaces = useSpaceOptions();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    idEspacio: '',
    tipoProfesional: '',
    password: '',
  });

  const canSubmit = useMemo(() => {
    if (!form.nombre || !form.email || !form.telefono) return false;
    if (includeSpace && !form.idEspacio) return false;
    if (includeProfessional && !form.tipoProfesional) return false;
    if (includePassword && !form.password) return false;
    return true;
  }, [form, includePassword, includeProfessional, includeSpace]);

  const change = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!canSubmit) {
      setError('Completá todos los campos obligatorios.');
      return;
    }

    setError('');
    setOk('');
    setIsLoading(true);

    try {
      const payload = {
        ...form,
        idEspacio: includeSpace ? Number(form.idEspacio) : null,
      };
      const response = await onSubmit(payload);
      setOk(response?.message || 'Registro exitoso');
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      setError(err.message || 'No se pudo registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid">
      <div className="form-grid">
        <div className="field">
          <label>Nombre</label>
          <input value={form.nombre} onChange={change('nombre')} />
        </div>
        <div className="field">
          <label>Email</label>
          <input value={form.email} onChange={change('email')} />
        </div>
        <div className="field">
          <label>Teléfono</label>
          <input value={form.telefono} onChange={change('telefono')} />
        </div>
        {includeSpace ? (
          <div className="field">
            <label>Espacio</label>
            <select value={form.idEspacio} onChange={change('idEspacio')}>
              <option value="">Seleccionar</option>
              {spaces.map((space) => (
                <option value={space.id} key={space.id}>
                  {space.nombre}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {includeProfessional ? (
          <div className="field">
            <label>Tipo profesional</label>
            <input value={form.tipoProfesional} onChange={change('tipoProfesional')} />
          </div>
        ) : null}
        {includePassword ? (
          <div className="field">
            <label>Contraseña</label>
            <input type="password" value={form.password} onChange={change('password')} />
          </div>
        ) : null}
      </div>

      {error ? <p className="error-text">{error}</p> : null}
      {ok ? <p className="success-text">{ok}</p> : null}

      <div className="actions-row">
        <button className="btn btn-primary" type="submit" disabled={isLoading}>
          Registrar
        </button>
        <button className="btn" type="button" onClick={() => navigate('/registro')}>
          Volver
        </button>
      </div>

      {isLoading ? <LoadingOverlay message="Registrando..." /> : null}
    </form>
  );
}

export function RegisterLandingPage() {
  return (
    <RegisterWrapper title="¿Cómo quieres participar en la red?" subtitle="Elige una opción">
      <div className="register-choices">
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/need-help.svg" alt="Necesito ayuda" />
          </div>
          <h3>Necesito ayuda</h3>
          <p>Quiero pedir acompañamiento</p>
          <Link to="/registro/necesito-ayuda" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', color: '#26a69a' }}>→</span>
          </Link>
        </article>
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/offer-help.svg" alt="Ofrezco ayuda" />
          </div>
          <h3>Ofrezco ayuda</h3>
          <p>Quiero sumarme a la red</p>
          <Link to="/registro/ofrezco-ayuda" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', color: '#26a69a' }}>→</span>
          </Link>
        </article>
      </div>
    </RegisterWrapper>
  );
}

export function NeedHelpPage() {
  return (
    <RegisterWrapper title="Necesito ayuda" subtitle="¿Para vos o para otra persona?">
      <div className="register-choices">
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/need-help.svg" alt="Para mi" />
          </div>
          <h3>Para mi</h3>
          <p>Registro en 2 pasos</p>
          <Link to="/registro/necesito-ayuda/usmya" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', color: '#26a69a' }}>→</span>
          </Link>
        </article>
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/offer-help.svg" alt="Para otra persona" />
          </div>
          <h3>Para otra persona</h3>
          <p>Alta de referente + persona</p>
          <Link to="/registro/necesito-ayuda/otro" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', color: '#26a69a' }}>→</span>
          </Link>
        </article>
      </div>
    </RegisterWrapper>
  );
}

export function OfferHelpPage() {
  return (
    <RegisterWrapper title="Ofrezco ayuda" subtitle="Eligi tu rol para completar el formulario">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/efector.svg" alt="Soy efector de salud" />
          </div>
          <h3>Soy efector de salud</h3>
          <p>Profesional de la salud</p>
          <Link to="/registro/ofrezco-ayuda/efector-salud" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', color: '#26a69a' }}>→</span>
          </Link>
        </article>
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/agente.svg" alt="Soy agente comunitario" />
          </div>
          <h3>Soy agente comunitario</h3>
          <p>Trabajador comunitario</p>
          <Link to="/registro/ofrezco-ayuda/agente-comunitario" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', color: '#26a69a' }}>→</span>
          </Link>
        </article>
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/referente.svg" alt="Soy referente afectivo" />
          </div>
          <h3>Soy referente afectivo</h3>
          <p>Apoyo emocional y afectivo</p>
          <Link to="/registro/ofrezco-ayuda/referente-afectivo" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', color: '#26a69a' }}>→</span>
          </Link>
        </article>
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/institucion.svg" alt="Registrar mi institución" />
          </div>
          <h3>Registrar mi institución</h3>
          <p>Completá la información de tu institución.</p>
          <Link to="/registro/ofrezco-ayuda/mi-institucion" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: '24px', color: '#26a69a' }}>→</span>
          </Link>
        </article>
      </div>
    </RegisterWrapper>
  );
}

export function EfectorSaludPage() {
  return (
    <RegisterWrapper title="Registro de Efector" subtitle="Alta de profesional de salud">
      <BasicPersonForm
        includeProfessional
        includeSpace
        onSubmit={(payload) =>
          registerService.postEfector({
            nombre: payload.nombre,
            email: payload.email,
            telefono: payload.telefono,
            idEspacio: payload.idEspacio,
            tipoProfesional: payload.tipoProfesional,
            password: payload.password,
            esETratante: true,
          })
        }
      />
    </RegisterWrapper>
  );
}

export function CommunityAgentPage() {
  return (
    <RegisterWrapper title="Registro de Agente" subtitle="Alta de agente comunitario">
      <BasicPersonForm
        includeSpace
        onSubmit={(payload) =>
          registerService.postAgente({
            nombre: payload.nombre,
            email: payload.email,
            telefono: payload.telefono,
            idEspacio: payload.idEspacio,
            password: payload.password,
          })
        }
      />
    </RegisterWrapper>
  );
}

export function AffectiveReferentPage() {
  return (
    <RegisterWrapper title="Registro de Referente" subtitle="Alta de referente afectivo">
      <BasicPersonForm
        onSubmit={(payload) =>
          registerService.postReferente({
            nombre: payload.nombre,
            email: payload.email,
            telefono: payload.telefono,
            password: payload.password,
            registroConUsmya: false,
          })
        }
      />
    </RegisterWrapper>
  );
}

export function NeedHelpUsmyaPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [step, setStep] = useState(1);
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
  });

  const estadoCivilOptions = [
    'Soltero/a',
    'Casado/a',
    'Divorciado/a',
    'Viudo/a',
    'Unión convivencial',
    'Otro',
  ];

  const change = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const canContinueStep1 =
    form.nombre.trim() &&
    form.dni.trim() &&
    form.fechaNacimiento.trim() &&
    form.telefono.trim();

  const handleNextStep1 = (e) => {
    e.preventDefault();
    setError('');
    
    if (!canContinueStep1) {
      setError('Completá todos los campos obligatorios del paso 1.');
      return;
    }
    
    setStep(2);
  };

  const handleBackStep2 = () => {
    setStep(1);
    setError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setOk('');

    if (!form.nombre || !form.dni || !form.fechaNacimiento || !form.telefono) {
      setError('Completá nombre, DNI, fecha de nacimiento y teléfono.');
      return;
    }

    if (!form.estadoCivil) {
      setError('Completá el estado civil.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerService.postUsmya({
        nombre: form.nombre,
        dni: Number(form.dni),
        fechaNacimiento: form.fechaNacimiento,
        telefono: form.telefono,
        direccionResidencia: form.direccionResidencia,
        alias: form.alias,
        generoAutoPercibido: form.generoAutoPercibido,
        estadoCivil: form.estadoCivil,
        obraSocial: form.obraSocial,
        requiereAprobacion: true,
        creadoPor: 0,
        password: 'Usmya2024*',
      });
      setOk(response.message || 'USMYA registrado correctamente');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'No se pudo registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterWrapper title="Registrarme - para mí" subtitle={step === 1 ? 'Datos básicos' : 'Datos complementarios'}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Paso {step} de 2
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '24px', height: '4px', backgroundColor: step >= 1 ? '#26a69a' : '#e0e0e0', borderRadius: '2px' }} />
          <div style={{ width: '24px', height: '4px', backgroundColor: step >= 2 ? '#26a69a' : '#e0e0e0', borderRadius: '2px' }} />
        </div>
      </div>

      {/* PASO 1: Datos básicos */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="grid">
          <div className="form-grid">
            <div className="field">
              <label>Apellido y Nombre *</label>
              <input
                placeholder="Ej: Juan Pérez"
                value={form.nombre}
                onChange={change('nombre')}
                required
              />
            </div>
            <div className="field">
              <label>D.N.I. *</label>
              <input
                placeholder="Solo números"
                value={form.dni}
                onChange={change('dni')}
                required
                inputMode="numeric"
              />
            </div>
            <div className="field">
              <label>Fecha de nacimiento *</label>
              <input
                type="date"
                value={form.fechaNacimiento}
                onChange={change('fechaNacimiento')}
                required
              />
            </div>
            <div className="field">
              <label>Número de contacto *</label>
              <input
                placeholder="351xxxxxxxx"
                value={form.telefono}
                onChange={change('telefono')}
                required
                inputMode="tel"
              />
            </div>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <div className="actions-row" style={{ justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              Siguiente
            </button>
          </div>
        </form>
      )}

      {/* PASO 2: Datos complementarios */}
      {step === 2 && (
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Dirección de residencia</label>
              <input
                placeholder="Ej: Calle Principal 123"
                value={form.direccionResidencia}
                onChange={change('direccionResidencia')}
                maxLength={200}
              />
            </div>
            <div className="field">
              <label>Alias de identificación</label>
              <input
                placeholder="Ej: Juan_Perez"
                value={form.alias}
                onChange={change('alias')}
                maxLength={60}
              />
            </div>
            <div className="field">
              <label>Género con el que se autopercibe</label>
              <input
                placeholder="Texto libre"
                value={form.generoAutoPercibido}
                onChange={change('generoAutoPercibido')}
                maxLength={100}
              />
            </div>
            <div className="field">
              <label>Estado civil *</label>
              <select value={form.estadoCivil} onChange={change('estadoCivil')} required>
                <option value="">Seleccione una opción</option>
                {estadoCivilOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label>Obra social</label>
            <input
              placeholder="Texto libre"
              value={form.obraSocial}
              onChange={change('obraSocial')}
              maxLength={100}
            />
          </div>

          {error ? <p className="error-text">{error}</p> : null}
          {ok ? <p className="success-text">{ok}</p> : null}

          <div className="actions-row" style={{ justifyContent: 'space-between', gap: '12px' }}>
            <button className="btn" type="button" onClick={handleBackStep2}>
              Anterior
            </button>
            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              Registrarse
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e0e0e0' }}>
        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#26a69a', fontWeight: '600', textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
        </p>
        <a
          href="tel:3513464561"
          className="btn btn-danger"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          Necesito ayuda urgente
        </a>
      </div>

      {isLoading ? <LoadingOverlay message="Registrando USMYA..." /> : null}
    </RegisterWrapper>
  );
}

export function NeedHelpOtherPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    referenteNombre: '',
    referenteEmail: '',
    referenteTelefono: '',
    referentePassword: '',
    usmyaNombre: '',
    usmyaDni: '',
    usmyaTelefono: '',
    usmyaFechaNacimiento: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const change = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const canContinueStep1 =
    form.referenteNombre.trim() &&
    form.referenteEmail.trim() &&
    form.referenteTelefono.trim() &&
    form.referentePassword.trim();

  const handleNextStep1 = (e) => {
    e.preventDefault();
    setError('');

    if (!canContinueStep1) {
      setError('Completá todos los datos obligatorios del referente.');
      return;
    }

    setStep(2);
  };

  const handleBackStep2 = () => {
    setStep(1);
    setError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setOk('');

    if (!form.referenteNombre || !form.referenteEmail || !form.referenteTelefono || !form.referentePassword) {
      setError('Completá todos los datos del referente.');
      return;
    }

    if (!form.usmyaNombre || !form.usmyaDni) {
      setError('Completá al menos el nombre y DNI del USMYA.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerService.postEfectorUsmya({
        referente: {
          nombre: form.referenteNombre,
          email: form.referenteEmail,
          telefono: form.referenteTelefono,
          password: form.referentePassword,
          registroConUsmya: true,
        },
        usmya: {
          nombre: form.usmyaNombre,
          dni: Number(form.usmyaDni),
          telefono: form.usmyaTelefono,
          fechaNacimiento: form.usmyaFechaNacimiento,
        },
      });

      setOk(response.message || 'Registro completo');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'No se pudo registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterWrapper title="Registro por tercero" subtitle={step === 1 ? 'Datos del referente' : 'Datos del USMYA'}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Paso {step} de 2
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '24px', height: '4px', backgroundColor: step >= 1 ? '#26a69a' : '#e0e0e0', borderRadius: '2px' }} />
          <div style={{ width: '24px', height: '4px', backgroundColor: step >= 2 ? '#26a69a' : '#e0e0e0', borderRadius: '2px' }} />
        </div>
      </div>

      {/* PASO 1: Datos del referente */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="grid">
          <div className="form-grid">
            <div className="field">
              <label>Nombre del referente *</label>
              <input
                placeholder="Ej: Juan Pérez"
                value={form.referenteNombre}
                onChange={change('referenteNombre')}
                required
              />
            </div>
            <div className="field">
              <label>Email del referente *</label>
              <input
                placeholder="Ej: juan@example.com"
                type="email"
                value={form.referenteEmail}
                onChange={change('referenteEmail')}
                required
              />
            </div>
            <div className="field">
              <label>Teléfono del referente *</label>
              <input
                placeholder="Ej: 351-123-4567"
                value={form.referenteTelefono}
                onChange={change('referenteTelefono')}
                required
              />
            </div>
            <div className="field">
              <label>Contraseña *</label>
              <input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.referentePassword}
                onChange={change('referentePassword')}
                required
              />
            </div>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <div className="actions-row" style={{ justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-primary" type="submit">
              Siguiente
            </button>
          </div>
        </form>
      )}

      {/* PASO 2: Datos del USMYA */}
      {step === 2 && (
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Nombre del USMYA *</label>
              <input
                placeholder="Ej: María García"
                value={form.usmyaNombre}
                onChange={change('usmyaNombre')}
                required
              />
            </div>
            <div className="field">
              <label>D.N.I. del USMYA *</label>
              <input
                placeholder="Solo números"
                value={form.usmyaDni}
                onChange={change('usmyaDni')}
                required
                inputMode="numeric"
              />
            </div>
            <div className="field">
              <label>Teléfono del USMYA</label>
              <input
                placeholder="Ej: 351-987-6543"
                value={form.usmyaTelefono}
                onChange={change('usmyaTelefono')}
              />
            </div>
            <div className="field">
              <label>Fecha de nacimiento del USMYA</label>
              <input
                type="date"
                value={form.usmyaFechaNacimiento}
                onChange={change('usmyaFechaNacimiento')}
              />
            </div>
          </div>

          {error ? <p className="error-text">{error}</p> : null}
          {ok ? <p className="success-text">{ok}</p> : null}

          <div className="actions-row" style={{ justifyContent: 'space-between', gap: '12px' }}>
            <button className="btn" type="button" onClick={handleBackStep2}>
              Anterior
            </button>
            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              Registrar
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e0e0e0' }}>
        <p style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#26a69a', fontWeight: '600', textDecoration: 'none' }}>
            Iniciar sesión
          </Link>
        </p>
        <a
          href="tel:3513464561"
          className="btn btn-danger"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          Necesito ayuda urgente
        </a>
      </div>

      {isLoading ? <LoadingOverlay message="Registrando datos..." /> : null}
    </RegisterWrapper>
  );
}

const poblacionVinculadaOptions = ['Niños', 'Adolescentes', 'Jóvenes', 'Adultos', 'Mayores', 'Familias', 'Otros'];

const tipoOrganizacionOptions = [
  'estatal',
  'comunitario',
  'educacion',
  'merendero',
  'comedor',
  'deportiva',
  'religiosa',
  'centro vecinal',
  'salud',
  'otros',
];

const confirmacionParticipacionOptions = [
  { value: 'conversacion', label: 'Conversación previa para acordar cuándo y cómo' },
  { value: 'whatsapp', label: 'Sólo con aviso por whatsapp' },
  { value: 'abierta', label: 'Actividad abierta sin necesidad de confirmación' },
  { value: 'otro', label: 'Otro' },
];

export function SpaceRegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  
  const [spaceForm, setSpaceForm] = useState({
    nombre: '',
    telefono: '',
    tipoOrganizacion: 'comunitario',
    direccion: '',
    barrio: '',
    encargado: '',
    diasHorarios: '',
    cuentaConInternet: false,
    cuentaConDispositivo: false,
    poblacionVinculada: [],
  });

  const [activityForm, setActivityForm] = useState({
    nombre: '',
    tipo: 'principal',
    descripcion: '',
    diasHorarios: '',
    confirmacionParticipacion: 'conversacion',
  });

  const [activities, setActivities] = useState([]);

  const changeSpace = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSpaceForm((prev) => ({ ...prev, [key]: value }));
  };

  const togglePoblacion = (poblacion) => {
    setSpaceForm((prev) => ({
      ...prev,
      poblacionVinculada: prev.poblacionVinculada.includes(poblacion)
        ? prev.poblacionVinculada.filter((p) => p !== poblacion)
        : [...prev.poblacionVinculada, poblacion],
    }));
  };

  const changeActivity = (key) => (event) => {
    const value = event.target.type === 'radio' ? event.target.value : event.target.value;
    setActivityForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    setError('');

    if (!spaceForm.nombre.trim() || !spaceForm.telefono.trim() || !spaceForm.encargado.trim()) {
      setError('Nombre, teléfono y encargado son obligatorios.');
      return;
    }

    setStep(2);
  };

  const handleBackStep2 = () => {
    setStep(1);
    setError('');
  };

  const addActivity = (e) => {
    e.preventDefault();
    setError('');

    if (!activityForm.nombre.trim() || !activityForm.diasHorarios.trim() || !activityForm.descripcion.trim()) {
      setError('Nombre, días/horarios y descripción de la actividad son obligatorios.');
      return;
    }

    setActivities([
      ...activities,
      {
        ...activityForm,
        id: Date.now(),
      },
    ]);

    setActivityForm({
      nombre: '',
      tipo: 'principal',
      descripcion: '',
      diasHorarios: '',
      confirmacionParticipacion: 'conversacion',
    });
  };

  const removeActivity = (id) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setOk('');
    setIsLoading(true);

    try {
      const payload = {
        nombre: spaceForm.nombre.trim(),
        telefono: spaceForm.telefono.trim(),
        tipoOrganizacion: spaceForm.tipoOrganizacion,
        direccion: spaceForm.direccion.trim(),
        barrio: spaceForm.barrio.trim(),
        encargado: spaceForm.encargado.trim(),
        diasHorarios: spaceForm.diasHorarios.trim(),
        poblacionVinculada: spaceForm.poblacionVinculada,
        cuentaConInternet: spaceForm.cuentaConInternet,
        cuentaConDispositivo: spaceForm.cuentaConDispositivo,
        actividadEspacio: activities.map(({ id, ...activity }) => activity),
      };

      const response = await registerService.registerEspacio(payload);
      setOk(response.message || 'Espacio registrado correctamente');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'No se pudo registrar el espacio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterWrapper title="Registro - Mi institución" subtitle={step === 1 ? 'Completá los datos de tu institución' : 'Agregá actividades a tu institución'}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Paso {step} de 2
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '24px', height: '4px', backgroundColor: step >= 1 ? '#26a69a' : '#e0e0e0', borderRadius: '2px' }} />
          <div style={{ width: '24px', height: '4px', backgroundColor: step >= 2 ? '#26a69a' : '#e0e0e0', borderRadius: '2px' }} />
        </div>
      </div>

      {/* PASO 1: Información básica del espacio */}
      {step === 1 && (
        <form onSubmit={handleNextStep1} className="grid">
          <div className="form-grid">
            <div className="field">
              <label>Nombre del Espacio *</label>
              <input
                placeholder="Ej: Centro Comunitario Norte"
                value={spaceForm.nombre}
                onChange={changeSpace('nombre')}
                required
              />
            </div>
            <div className="field">
              <label>Teléfono *</label>
              <input
                placeholder="Ej: 351-123-4567"
                value={spaceForm.telefono}
                onChange={changeSpace('telefono')}
                required
              />
            </div>
            <div className="field">
              <label>Tipo de Organización *</label>
              <select value={spaceForm.tipoOrganizacion} onChange={changeSpace('tipoOrganizacion')}>
                {tipoOrganizacionOptions.map((item) => (
                  <option key={item} value={item}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Dirección</label>
              <input
                placeholder="Ej: Av. Colon 1234"
                value={spaceForm.direccion}
                onChange={changeSpace('direccion')}
              />
            </div>
            <div className="field">
              <label>Barrio</label>
              <input
                placeholder="Ej: Centro"
                value={spaceForm.barrio}
                onChange={changeSpace('barrio')}
              />
            </div>
            <div className="field">
              <label>¿Quién o quiénes están a cargo? *</label>
              <input
                placeholder="Nombre del responsable"
                value={spaceForm.encargado}
                onChange={changeSpace('encargado')}
                required
              />
            </div>
          </div>

          <div className="field">
            <label>Días y horarios de atención</label>
            <input
              placeholder="Ej: Lunes a Viernes 9:00-18:00"
              value={spaceForm.diasHorarios}
              onChange={changeSpace('diasHorarios')}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
              ¿Cuenta con dispositivo móvil/computadora?
            </label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="dispositivo"
                  value="true"
                  checked={spaceForm.cuentaConDispositivo === true}
                  onChange={() => setSpaceForm((prev) => ({ ...prev, cuentaConDispositivo: true }))}
                />
                <span>Sí</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="dispositivo"
                  value="false"
                  checked={spaceForm.cuentaConDispositivo === false}
                  onChange={() => setSpaceForm((prev) => ({ ...prev, cuentaConDispositivo: false }))}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          <div className="field">
            <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
              Población Vinculada
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {poblacionVinculadaOptions.map((poblacion) => (
                <label key={poblacion} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={spaceForm.poblacionVinculada.includes(poblacion)}
                    onChange={() => togglePoblacion(poblacion)}
                  />
                  <span>{poblacion}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
              ¿Cuenta con internet?
            </label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="internet"
                  value="true"
                  checked={spaceForm.cuentaConInternet === true}
                  onChange={() => setSpaceForm((prev) => ({ ...prev, cuentaConInternet: true }))}
                />
                <span>Sí</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="internet"
                  value="false"
                  checked={spaceForm.cuentaConInternet === false}
                  onChange={() => setSpaceForm((prev) => ({ ...prev, cuentaConInternet: false }))}
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {error ? <p className="error-text">{error}</p> : null}

          <div className="actions-row" style={{ justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-primary" type="submit">
              Siguiente
            </button>
          </div>
        </form>
      )}

      {/* PASO 2: Agregar actividades */}
      {step === 2 && (
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e0e0e0' }}>
            <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>Agregar Nueva Actividad</h3>

            <div className="form-grid">
              <div className="field">
                <label>Nombre de la Actividad *</label>
                <input
                  placeholder="Ej: Taller de Arte, Clases de Matemáticas"
                  value={activityForm.nombre}
                  onChange={changeActivity('nombre')}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
                Tipo de Actividad
              </label>
              <div style={{ display: 'flex', gap: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="tipoActividad"
                    value="principal"
                    checked={activityForm.tipo === 'principal'}
                    onChange={changeActivity('tipo')}
                  />
                  <span>Principal</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="tipoActividad"
                    value="secundario"
                    checked={activityForm.tipo === 'secundario'}
                    onChange={changeActivity('tipo')}
                  />
                  <span>Secundario</span>
                </label>
              </div>
            </div>

            <div className="field">
              <label>Descripción de lo que ofrece y a quién está dirigido *</label>
              <textarea
                placeholder="Describe detalladamente la actividad, qué ofrece y a qué público está dirigida..."
                value={activityForm.descripcion}
                onChange={changeActivity('descripcion')}
                rows="3"
                style={{ minHeight: '100px' }}
              />
            </div>

            <div className="field">
              <label>Días y Horarios *</label>
              <input
                placeholder="Ej: Lunes y Miércoles 14:00-16:00"
                value={activityForm.diasHorarios}
                onChange={changeActivity('diasHorarios')}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '12px' }}>
                En caso de que referencimos a una persona para que participe de esta actividad, ¿qué forma de confirmar que efectivamente pudo participar proponen?
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {confirmacionParticipacionOptions.map((option) => (
                  <label key={option.value} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="confirmacion"
                      value={option.value}
                      checked={activityForm.confirmacionParticipacion === option.value}
                      onChange={changeActivity('confirmacionParticipacion')}
                      style={{ marginTop: '4px' }}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error ? <p className="error-text">{error}</p> : null}

            <div className="actions-row" style={{ justifyContent: 'center', gap: '12px' }}>
              <button className="btn btn-primary" type="button" onClick={addActivity}>
                Agregar Actividad
              </button>
            </div>
          </div>

          {/* Lista de actividades agregadas */}
          {activities.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ marginBottom: '12px', fontSize: '14px', fontWeight: 'bold' }}>Actividades Agregadas ({activities.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    style={{
                      padding: '12px',
                      backgroundColor: '#f5f5f5',
                      borderRadius: '4px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <strong>{activity.nombre}</strong>
                      <p style={{ fontSize: '12px', color: '#666', margin: '4px 0 0 0' }}>
                        {activity.tipo === 'principal' ? 'Principal' : 'Secundario'} • {activity.diasHorarios}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeActivity(activity.id)}
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ok ? <p className="success-text">{ok}</p> : null}

          <div className="actions-row" style={{ justifyContent: 'space-between', gap: '12px' }}>
            <button className="btn" type="button" onClick={handleBackStep2}>
              Volver
            </button>
            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              Registrar Espacio
            </button>
          </div>
        </form>
      )}

      {isLoading ? <LoadingOverlay message="Registrando institución..." /> : null}
    </RegisterWrapper>
  );
}

