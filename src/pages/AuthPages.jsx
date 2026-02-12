import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingOverlay from '../components/LoadingOverlay';
import { useAuthStore } from '../store/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const restoreFromLegacyToken = useAuthStore((state) => state.restoreFromLegacyToken);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    restoreFromLegacyToken();
  }, [restoreFromLegacyToken]);

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');

    if (!email.trim() || !password.trim()) {
      setLocalError('Ingresa email y contrasena.');
      return;
    }

    const result = await login(email.trim(), password);
    if (result.success) {
      navigate('/');
    }
  };

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

      <div className="auth-shell">
        <div className="auth-branding">
          <h1>MappA</h1>
          <div className="auth-branding__line" />
          <p>Red Comunitaria</p>
        </div>

        <section className="auth-card">
          <div className="auth-card__glow" />
          <div className="auth-card__content">
            <header className="auth-card__header">
              <h2>Iniciar sesion</h2>
              <p>Ingresa tus credenciales</p>
            </header>

            <form className="auth-form" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="email">Email o DNI</label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@test.com"
                />
              </div>

              <div className="field">
                <label htmlFor="password">Contrasena</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                />
              </div>

              {localError ? <p className="error-text">{localError}</p> : null}
              {error ? <p className="error-text">{error}</p> : null}

              <button className="btn btn-primary auth-submit" type="submit" disabled={isLoading}>
                Ingresar
              </button>
            </form>

            <div className="auth-links">
              <span className="page-meta">Olvidaste tu contrasena?</span>
              <Link to="/registro">Registrate</Link>
            </div>

            <p className="page-meta auth-credentials">
              Prueba: admin@test.com, agente@test.com, efector@test.com, referente@test.com, usmya@test.com.
            </p>
          </div>
          <div className="auth-card__bar" />
        </section>

        <p className="auth-footer">Conectando comunidades - Construyendo futuro</p>
      </div>

      {isLoading ? <LoadingOverlay message="Iniciando sesion..." /> : null}
    </div>
  );
}
