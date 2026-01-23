import React, { useState } from 'react';
import './Login.css';
import colors from '../../config/colors';
import { login } from '../../services/authService';

const Login = ({ onNavigate }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const [errors, setErrors] = useState({});

  const validate = (data) => {
    const nextErrors = {};
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      nextErrors.email = 'Email inválido.';
    }
    if (!data.password || data.password.length < 8) {
      nextErrors.password = 'Senha deve ter ao menos 8 caracteres.';
    }
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    const nextErrors = validate(formData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus({ loading: false, error: null, success: null });
      return;
    }

    try {
      await login(formData);
      setStatus({ loading: false, error: null, success: 'Login realizado com sucesso!' });
      if (onNavigate) {
        onNavigate('home');
      }
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
    }
  };

  return (
    <div className="auth-page" style={{ backgroundColor: colors.background.default }}>
      <div className="auth-card" style={{ backgroundColor: colors.background.paper, borderColor: colors.divider }}>
        <h2 style={{ color: colors.text.primary }}>Entrar</h2>
        <p style={{ color: colors.text.secondary }}>Acesse sua conta para continuar.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label" style={{ color: colors.text.primary }}>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              maxLength={120}
              className={`auth-input ${errors.email ? 'invalid' : ''}`}
            />
            {errors.email && <span className="auth-error-text">{errors.email}</span>}
          </label>

          <label className="auth-label" style={{ color: colors.text.primary }}>
            Senha
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`auth-input ${errors.password ? 'invalid' : ''}`}
              maxLength={50}
            />
            {errors.password && <span className="auth-error-text">{errors.password}</span>}
          </label>

          {status.error && (
            <div className="auth-alert error">{status.error}</div>
          )}
          {status.success && (
            <div className="auth-alert success">{status.success}</div>
          )}

          <button
            type="submit"
            className="auth-button"
            style={{ backgroundColor: colors.primary.main, color: colors.primary.contrastText }}
            disabled={status.loading}
          >
            {status.loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="auth-links">
          <button type="button" onClick={() => onNavigate && onNavigate('forgot')}>
            Esqueci minha senha
          </button>
          <button type="button" onClick={() => onNavigate && onNavigate('register')}>
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
