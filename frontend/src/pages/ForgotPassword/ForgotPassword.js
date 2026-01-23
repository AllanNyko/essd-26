import React, { useState } from 'react';
import './ForgotPassword.css';
import colors from '../../config/colors';
import { forgotPassword } from '../../services/authService';

const ForgotPassword = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const [errors, setErrors] = useState({});

  const validate = (value) => {
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Email inválido.';
    }
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    const emailError = validate(email);
    if (emailError) {
      setErrors({ email: emailError });
      setStatus({ loading: false, error: null, success: null });
      return;
    }

    try {
      const response = await forgotPassword({ email });
      setStatus({ loading: false, error: null, success: response.message || 'Email enviado.' });
      setErrors({});
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: null });
    }
  };

  return (
    <div className="auth-page" style={{ backgroundColor: colors.background.default }}>
      <div className="auth-card" style={{ backgroundColor: colors.background.paper, borderColor: colors.divider }}>
        <h2 style={{ color: colors.text.primary }}>Recuperar senha</h2>
        <p style={{ color: colors.text.secondary }}>
          Informe seu email para receber o link de redefinição.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label" style={{ color: colors.text.primary }}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors({});
              }}
              required
              maxLength={120}
              className={`auth-input ${errors.email ? 'invalid' : ''}`}
            />
            {errors.email && <span className="auth-error-text">{errors.email}</span>}
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
            {status.loading ? 'Enviando...' : 'Enviar link'}
          </button>
        </form>

        <div className="auth-links">
          <button type="button" onClick={() => onNavigate && onNavigate('login')}>
            Voltar para login
          </button>
          <button type="button" onClick={() => onNavigate && onNavigate('register')}>
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
