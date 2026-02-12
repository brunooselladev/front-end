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
    <RegisterWrapper title="Registro" subtitle="Elegi como queres continuar">
      <div className="register-choices">
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/need-help.svg" alt="Necesito ayuda" />
          </div>
          <h3>Necesito ayuda</h3>
          <p>Registro de USMYA o por tercero.</p>
          <div className="actions-row">
            <Link className="btn btn-primary btn-link" to="/registro/necesito-ayuda">
              Continuar
            </Link>
          </div>
        </article>
        <article className="card register-choice-card">
          <div className="register-choice-card__icon">
            <img src="/assets/offer-help.svg" alt="Ofrezco ayuda" />
          </div>
          <h3>Ofrezco ayuda</h3>
          <p>Registro de efectores, agentes, referentes y espacios.</p>
          <div className="actions-row">
            <Link className="btn btn-primary btn-link" to="/registro/ofrezco-ayuda">
              Continuar
            </Link>
          </div>
        </article>
      </div>
    </RegisterWrapper>
  );
}

export function NeedHelpPage() {
  return (
    <RegisterWrapper title="Necesito ayuda" subtitle="Selecciona el tipo de registro">
      <div className="actions-row register-action-grid">
        <Link className="btn btn-primary btn-link" to="/registro/necesito-ayuda/usmya">
          Soy USMYA
        </Link>
        <Link className="btn btn-link" to="/registro/necesito-ayuda/otro">
          Registro por tercero
        </Link>
      </div>
    </RegisterWrapper>
  );
}

export function OfferHelpPage() {
  return (
    <RegisterWrapper title="Ofrezco ayuda" subtitle="Selecciona el perfil">
      <div className="actions-row register-action-grid">
        <Link className="btn btn-primary btn-link" to="/registro/ofrezco-ayuda/efector-salud">
          Efector
        </Link>
        <Link className="btn btn-link" to="/registro/ofrezco-ayuda/agente-comunitario">
          Agente
        </Link>
        <Link className="btn btn-link" to="/registro/ofrezco-ayuda/referente-afectivo">
          Referente
        </Link>
        <Link className="btn btn-link" to="/registro/ofrezco-ayuda/mi-institucion">
          Mi institución
        </Link>
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

  const change = (key) => (event) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setOk('');

    if (!form.nombre || !form.dni || !form.fechaNacimiento || !form.telefono) {
      setError('Completá nombre, DNI, fecha de nacimiento y teléfono.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerService.postUsmya({
        ...form,
        dni: Number(form.dni),
        requiereAprobacion: true,
        creadoPor: 0,
        password: 'Usmya2024*',
      });
      setOk(response.message || 'USMYA registrado');
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      setError(err.message || 'No se pudo registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterWrapper title="Registro USMYA" subtitle="Completá datos personales">
      <form onSubmit={onSubmit} className="grid">
        <div className="form-grid">
          <div className="field">
            <label>Nombre</label>
            <input value={form.nombre} onChange={change('nombre')} />
          </div>
          <div className="field">
            <label>DNI</label>
            <input value={form.dni} onChange={change('dni')} />
          </div>
          <div className="field">
            <label>Fecha de nacimiento</label>
            <input type="date" value={form.fechaNacimiento} onChange={change('fechaNacimiento')} />
          </div>
          <div className="field">
            <label>Teléfono</label>
            <input value={form.telefono} onChange={change('telefono')} />
          </div>
          <div className="field">
            <label>Dirección</label>
            <input value={form.direccionResidencia} onChange={change('direccionResidencia')} />
          </div>
          <div className="field">
            <label>Alias</label>
            <input value={form.alias} onChange={change('alias')} />
          </div>
          <div className="field">
            <label>Género autopercibido</label>
            <input value={form.generoAutoPercibido} onChange={change('generoAutoPercibido')} />
          </div>
          <div className="field">
            <label>Estado civil</label>
            <input value={form.estadoCivil} onChange={change('estadoCivil')} />
          </div>
          <div className="field">
            <label>Obra social</label>
            <input value={form.obraSocial} onChange={change('obraSocial')} />
          </div>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
        {ok ? <p className="success-text">{ok}</p> : null}

        <div className="actions-row">
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            Registrar
          </button>
          <button className="btn" type="button" onClick={() => navigate('/registro/necesito-ayuda')}>
            Volver
          </button>
        </div>
      </form>

      {isLoading ? <LoadingOverlay message="Registrando USMYA..." /> : null}
    </RegisterWrapper>
  );
}

export function NeedHelpOtherPage() {
  const navigate = useNavigate();
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

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setOk('');

    if (
      !form.referenteNombre ||
      !form.referenteEmail ||
      !form.referenteTelefono ||
      !form.referentePassword ||
      !form.usmyaNombre ||
      !form.usmyaDni
    ) {
      setError('Completá todos los datos obligatorios.');
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
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      setError(err.message || 'No se pudo registrar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterWrapper title="Registro por tercero" subtitle="Referente + USMYA">
      <form onSubmit={onSubmit} className="grid">
        <div className="card">
          <h3>Datos del referente</h3>
          <div className="form-grid">
            <div className="field">
              <label>Nombre</label>
              <input value={form.referenteNombre} onChange={change('referenteNombre')} />
            </div>
            <div className="field">
              <label>Email</label>
              <input value={form.referenteEmail} onChange={change('referenteEmail')} />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input value={form.referenteTelefono} onChange={change('referenteTelefono')} />
            </div>
            <div className="field">
              <label>Contraseña</label>
              <input type="password" value={form.referentePassword} onChange={change('referentePassword')} />
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Datos de USMYA</h3>
          <div className="form-grid">
            <div className="field">
              <label>Nombre</label>
              <input value={form.usmyaNombre} onChange={change('usmyaNombre')} />
            </div>
            <div className="field">
              <label>DNI</label>
              <input value={form.usmyaDni} onChange={change('usmyaDni')} />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input value={form.usmyaTelefono} onChange={change('usmyaTelefono')} />
            </div>
            <div className="field">
              <label>Fecha de nacimiento</label>
              <input type="date" value={form.usmyaFechaNacimiento} onChange={change('usmyaFechaNacimiento')} />
            </div>
          </div>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
        {ok ? <p className="success-text">{ok}</p> : null}

        <div className="actions-row">
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            Registrar
          </button>
          <button className="btn" type="button" onClick={() => navigate('/registro/necesito-ayuda')}>
            Volver
          </button>
        </div>
      </form>

      {isLoading ? <LoadingOverlay message="Registrando datos..." /> : null}
    </RegisterWrapper>
  );
}

export function SpaceRegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    tipoOrganizacion: 'comunitario',
    direccion: '',
    barrio: '',
    encargado: '',
    diasHorarios: '',
    cuentaConInternet: false,
    cuentaConDispositivo: false,
    poblacionVinculadaRaw: '',
  });

  const change = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setOk('');

    if (!form.nombre || !form.telefono || !form.encargado) {
      setError('Nombre, teléfono y encargado son obligatorios.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        nombre: form.nombre,
        telefono: form.telefono,
        tipoOrganizacion: form.tipoOrganizacion,
        direccion: form.direccion,
        barrio: form.barrio,
        encargado: form.encargado,
        diasHorarios: form.diasHorarios,
        poblacionVinculada: form.poblacionVinculadaRaw
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        actividadEspacio: [],
        cuentaConInternet: form.cuentaConInternet,
        cuentaConDispositivo: form.cuentaConDispositivo,
      };

      const response = await registerService.registerEspacioInMongo(payload);
      setOk(response.message || 'Espacio registrado');
      setTimeout(() => navigate('/login'), 700);
    } catch (err) {
      setError(err.message || 'No se pudo registrar el espacio');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterWrapper title="Registro de institución" subtitle="Alta de espacio comunitario">
      <form onSubmit={onSubmit} className="grid">
        <div className="form-grid">
          <div className="field">
            <label>Nombre</label>
            <input value={form.nombre} onChange={change('nombre')} />
          </div>
          <div className="field">
            <label>Teléfono</label>
            <input value={form.telefono} onChange={change('telefono')} />
          </div>
          <div className="field">
            <label>Tipo organización</label>
            <select value={form.tipoOrganizacion} onChange={change('tipoOrganizacion')}>
              <option value="estatal">Estatal</option>
              <option value="comunitario">Comunitario</option>
              <option value="educacion">Educación</option>
              <option value="merendero">Merendero</option>
              <option value="comedor">Comedor</option>
              <option value="deportiva">Deportiva</option>
              <option value="religiosa">Religiosa</option>
              <option value="centro vecinal">Centro vecinal</option>
              <option value="otros">Otros</option>
            </select>
          </div>
          <div className="field">
            <label>Encargado</label>
            <input value={form.encargado} onChange={change('encargado')} />
          </div>
          <div className="field">
            <label>Dirección</label>
            <input value={form.direccion} onChange={change('direccion')} />
          </div>
          <div className="field">
            <label>Barrio</label>
            <input value={form.barrio} onChange={change('barrio')} />
          </div>
          <div className="field">
            <label>Días/horarios</label>
            <input value={form.diasHorarios} onChange={change('diasHorarios')} />
          </div>
          <div className="field">
            <label>Población vinculada (coma separada)</label>
            <input value={form.poblacionVinculadaRaw} onChange={change('poblacionVinculadaRaw')} />
          </div>
        </div>

        <div className="actions-row">
          <label className="field" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <input type="checkbox" checked={form.cuentaConInternet} onChange={change('cuentaConInternet')} />
            <span>Cuenta con internet</span>
          </label>
          <label className="field" style={{ flexDirection: 'row', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={form.cuentaConDispositivo}
              onChange={change('cuentaConDispositivo')}
            />
            <span>Cuenta con dispositivo</span>
          </label>
        </div>

        {error ? <p className="error-text">{error}</p> : null}
        {ok ? <p className="success-text">{ok}</p> : null}

        <div className="actions-row">
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            Registrar espacio
          </button>
          <button className="btn" type="button" onClick={() => navigate('/registro/ofrezco-ayuda')}>
            Volver
          </button>
        </div>
      </form>

      {isLoading ? <LoadingOverlay message="Registrando institución..." /> : null}
    </RegisterWrapper>
  );
}

