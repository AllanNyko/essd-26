import React, { useState, useEffect } from 'react';
import './Register.css';
import colors from '../../config/colors';
import { register } from '../../services/authService';
import { planService } from '../../services/planService';

const Register = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    plan_id: null,
  });
  const [status, setStatus] = useState({ loading: false, error: null, success: null });
  const [showPhoneInfo, setShowPhoneInfo] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (currentStep === 2) {
      loadPlans();
    }
  }, [currentStep]);

  const loadPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await planService.getPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error) {
      setStatus({ loading: false, error: 'Erro ao carregar planos', success: null });
    } finally {
      setLoadingPlans(false);
    }
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const validateStep1 = (data) => {
    const nextErrors = {};
    if (!data.name || data.name.trim().length < 2) {
      nextErrors.name = 'Informe seu nome completo.';
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      nextErrors.email = 'Email inválido.';
    }
    const digits = data.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) {
      nextErrors.phone = 'Telefone deve ter 10 ou 11 dígitos.';
    }
    if (!data.password || data.password.length < 8) {
      nextErrors.password = 'Senha deve ter ao menos 8 caracteres.';
    }
    if (data.password !== data.password_confirmation) {
      nextErrors.password_confirmation = 'As senhas não coincidem.';
    }
    return nextErrors;
  };

  const validateStep2 = (data) => {
    const nextErrors = {};
    if (!data.plan_id) {
      nextErrors.plan_id = 'Selecione um plano para continuar.';
    }
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newValue = name === 'phone' ? formatPhone(value) : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleNextStep = (event) => {
    event.preventDefault();
    const nextErrors = validateStep1(formData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setCurrentStep(2);
  };

  const handlePlanSelect = (planId) => {
    setFormData((prev) => ({ ...prev, plan_id: planId }));
    setErrors((prev) => ({ ...prev, plan_id: null }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, error: null, success: null });

    const nextErrors = validateStep2(formData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus({ loading: false, error: null, success: null });
      return;
    }

    try {
      const response = await register(formData);
      if (response.success) {
        setStatus({ loading: false, error: null, success: response.message });
        setTimeout(() => {
          if (onNavigate) {
            onNavigate('home');
          }
        }, 1000);
      }
    } catch (error) {
      setStatus({ 
        loading: false, 
        error: error.message || 'Erro ao realizar cadastro', 
        success: null 
      });
    }
  };

  return (
    <div className="auth-page" style={{ backgroundColor: colors.background.default }}>
      <div className="auth-card register-stepper-card" style={{ backgroundColor: colors.background.paper, borderColor: colors.divider }}>
        {/* Stepper Indicator */}
        <div className="stepper-indicator">
          <div className="stepper-step">
            <div className={`stepper-circle ${currentStep >= 1 ? 'active' : ''}`}>1</div>
            <span className="stepper-label">Dados pessoais</span>
          </div>
          <div className="stepper-line" />
          <div className="stepper-step">
            <div className={`stepper-circle ${currentStep >= 2 ? 'active' : ''}`}>2</div>
            <span className="stepper-label">Escolha o plano</span>
          </div>
        </div>

        {/* Step 1: Personal Data */}
        {currentStep === 1 && (
          <>
            <h2 style={{ color: colors.text.primary }}>Criar conta</h2>
            <p style={{ color: colors.text.secondary }}>Preencha os dados para começar.</p>

            <form onSubmit={handleNextStep} className="auth-form">
              <label className="auth-label" style={{ color: colors.text.primary }}>
                Nome
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  className={`auth-input ${errors.name ? 'invalid' : ''}`}
                />
                {errors.name && <span className="auth-error-text">{errors.name}</span>}
              </label>

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
                <span className="auth-label-inline">
                  Telefone
                  <button
                    type="button"
                    className="auth-info-icon"
                    aria-label="Informações sobre telefone"
                    onClick={() => setShowPhoneInfo((prev) => !prev)}
                  >
                    ℹ️
                  </button>
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`auth-input ${errors.phone ? 'invalid' : ''}`}
                  placeholder="(99) 99999-9999"
                  maxLength={16}
                />
                {showPhoneInfo && (
                  <small className="auth-help-text">
                    Não entraremos em contato. Usamos este número apenas para envio de SMS de ativação.
                  </small>
                )}
                {errors.phone && <span className="auth-error-text">{errors.phone}</span>}
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

              <label className="auth-label" style={{ color: colors.text.primary }}>
                Confirmar senha
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  className={`auth-input ${errors.password_confirmation ? 'invalid' : ''}`}
                  maxLength={50}
                />
                {errors.password_confirmation && <span className="auth-error-text">{errors.password_confirmation}</span>}
              </label>

              <button
                type="submit"
                className="auth-button"
                style={{ backgroundColor: colors.primary.main }}
              >
                Próximo
              </button>

              <p style={{ color: colors.text.secondary }} className="auth-footer-text">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  className="auth-link"
                  style={{ color: colors.primary.main }}
                  onClick={() => onNavigate('login')}
                >
                  Fazer login
                </button>
              </p>
            </form>
          </>
        )}

        {/* Step 2: Plan Selection */}
        {currentStep === 2 && (
          <>
            <h2 style={{ color: colors.text.primary }}>Escolha seu plano</h2>
            <p style={{ color: colors.text.secondary }}>Selecione o plano ideal para seus estudos.</p>

            {loadingPlans ? (
              <div className="plan-loading">Carregando planos...</div>
            ) : (
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="plans-grid">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`plan-card ${formData.plan_id === plan.id ? 'selected' : ''}`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      <div className="plan-header">
                        <h3>{plan.name}</h3>
                        <div className="plan-price">
                          {plan.price === 0 || plan.price === '0.00' ? (
                            <span className="price-free">Grátis</span>
                          ) : (
                            <>
                              <span className="price-value">{formatPrice(plan.price)}</span>
                              <span className="price-period">/{plan.duration_days} dias</span>
                            </>
                          )}
                        </div>
                      </div>
                      <p className="plan-description">{plan.description}</p>
                      <ul className="plan-features">
                        {plan.features && plan.features.map((feature, index) => (
                          <li key={index}>✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {errors.plan_id && <span className="auth-error-text center">{errors.plan_id}</span>}

                {status.error && (
                  <div className="auth-status error">{status.error}</div>
                )}
                {status.success && (
                  <div className="auth-status success">{status.success}</div>
                )}

                <div className="stepper-actions">
                  <button
                    type="button"
                    className="auth-button secondary"
                    onClick={() => setCurrentStep(1)}
                    disabled={status.loading}
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="auth-button"
                    style={{ backgroundColor: colors.primary.main }}
                    disabled={status.loading || !formData.plan_id}
                  >
                    {status.loading ? 'Cadastrando...' : 'Finalizar cadastro'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
