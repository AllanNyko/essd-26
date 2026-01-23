import React, { useEffect, useState } from 'react';
import './Plans.css';
import colors from '../../config/colors';
import { planService } from '../../services/planService';

const Plans = ({ onSelectPlan }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await planService.getPlans();
        if (response.success) {
          setPlans(response.data || []);
        } else {
          setError('Não foi possível carregar os planos.');
        }
      } catch (err) {
        setError(err.message || 'Erro ao carregar os planos.');
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  const formatPrice = (price, currency = 'BRL') => {
    if (Number(price) === 0) return 'Grátis';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency,
    }).format(Number(price));
  };

  const formatPeriod = (days) => {
    if (!days) return '';
    return `/${days} dias`;
  };

  const getIcon = (plan) => {
    if (Number(plan.price) === 0) return '🆓';
    if (plan.is_featured) return '⭐';
    return '💎';
  };

  const getButtonText = (plan) => {
    if (Number(plan.price) === 0) return 'Começar grátis';
    return `Assinar ${plan.name}`;
  };

  const handlePlanClick = (plan) => {
    if (onSelectPlan) onSelectPlan(plan);
  };

  return (
    <div className="plans" style={{ backgroundColor: colors.background.default }}>
      <div className="plans-container">
        {/* Header da Página */}
        <section className="plans-header">
          <h1 style={{ color: colors.text.primary }}>
            Escolha o Plano Ideal
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Soluções flexíveis para todas as necessidades
          </p>
        </section>

        {/* Grid de Planos */}
        <section className="plans-grid">
          {loading && (
            <div className="plan-loading">Carregando planos...</div>
          )}

          {error && !loading && (
            <div className="plan-error">{error}</div>
          )}

          {!loading && !error && plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.is_featured ? 'highlighted' : ''}`}
              style={{
                backgroundColor: colors.background.paper,
                borderColor: plan.is_featured ? colors.primary.main : colors.divider,
              }}
            >
              {plan.is_featured && (
                <div 
                  className="plan-badge"
                  style={{ backgroundColor: colors.primary.main }}
                >
                  <span style={{ color: colors.text.white }}>Mais Popular</span>
                </div>
              )}

              <div className="plan-header">
                <div className="plan-icon">{getIcon(plan)}</div>
                <h3 
                  className="plan-name"
                  style={{ color: colors.text.primary }}
                >
                  {plan.name}
                </h3>
                <p 
                  className="plan-description"
                  style={{ color: colors.text.secondary }}
                >
                  {plan.description}
                </p>
              </div>

              <div className="plan-price">
                <span 
                  className="price-value"
                  style={{ color: colors.text.primary }}
                >
                  {formatPrice(plan.price, plan.currency)}
                </span>
                <span 
                  className="price-period"
                  style={{ color: colors.text.secondary }}
                >
                  {formatPeriod(plan.duration_days)}
                </span>
              </div>

              <ul 
                className="plan-features"
                style={{ borderTopColor: colors.divider }}
              >
                {(plan.features || []).map((feature, index) => (
                  <li 
                    key={index}
                    style={{ color: colors.text.primary }}
                  >
                    <span className="feature-icon">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`plan-button ${plan.is_featured ? 'primary' : 'secondary'}`}
                onClick={() => handlePlanClick(plan)}
                style={{
                  backgroundColor: plan.is_featured ? colors.primary.main : 'transparent',
                  color: plan.is_featured ? colors.text.white : colors.primary.main,
                  borderColor: colors.primary.main,
                }}
              >
                {getButtonText(plan)}
              </button>
            </div>
          ))}
        </section>

        {/* FAQ Rápido */}
        <section className="plans-faq">
          <h2 style={{ color: colors.text.primary }}>
            Perguntas Frequentes
          </h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4 style={{ color: colors.text.primary }}>
                Posso mudar de plano depois?
              </h4>
              <p style={{ color: colors.text.secondary }}>
                Sim! Você pode fazer upgrade ou downgrade a qualquer momento.
              </p>
            </div>
            <div className="faq-item">
              <h4 style={{ color: colors.text.primary }}>
                Há período de teste?
              </h4>
              <p style={{ color: colors.text.secondary }}>
                Sim, todos os planos pagos têm 7 dias de garantia.
              </p>
            </div>
            <div className="faq-item">
              <h4 style={{ color: colors.text.primary }}>
                Como funciona o pagamento?
              </h4>
              <p style={{ color: colors.text.secondary }}>
                Aceitamos cartão de crédito, débito e boleto bancário.
              </p>
            </div>
            <div className="faq-item">
              <h4 style={{ color: colors.text.primary }}>
                Posso cancelar quando quiser?
              </h4>
              <p style={{ color: colors.text.secondary }}>
                Sim, sem taxas de cancelamento ou multas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Plans;
