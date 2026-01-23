import React, { useState } from 'react';
import './Library.css';
import colors from '../../config/colors';
import MaterialsView from '../../components/MaterialsView/MaterialsView';

const Library = ({ onNavigate }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentView, setCurrentView] = useState(null);

  const libraryOptions = [
    {
      id: 1,
      type: 'apostilas',
      title: 'Apostilas',
      subtitle: 'Material Didático Completo',
      description: 'Conteúdos estruturados e organizados para facilitar seu aprendizado',
      icon: '📚',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea',
      stats: {
        total: '150+',
        label: 'Apostilas disponíveis'
      },
      features: ['PDF de alta qualidade', 'Conteúdo atualizado', 'Download offline']
    },
    {
      id: 2,
      type: 'resumos',
      title: 'Resumos',
      subtitle: 'Sínteses Objetivas',
      description: 'Conteúdos condensados com os pontos mais importantes de cada tema',
      icon: '📝',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb',
      stats: {
        total: '300+',
        label: 'Resumos criados'
      },
      features: ['Formato visual', 'Fácil memorização', 'Revisão rápida']
    },
    {
      id: 3,
      type: 'mapas',
      title: 'Mapas Mentais',
      subtitle: 'Visualização Inteligente',
      description: 'Organize ideias e conceitos de forma visual e intuitiva',
      icon: '🧠',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe',
      stats: {
        total: '200+',
        label: 'Mapas disponíveis'
      },
      features: ['Hierarquia visual', 'Conexões lógicas', 'Interativo']
    },
    {
      id: 4,
      type: 'quizz',
      title: 'Quizz',
      subtitle: 'Teste seus Conhecimentos',
      description: 'Avalie seu aprendizado com questões práticas e feedback instantâneo',
      icon: '🎯',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      color: '#fa709a',
      stats: {
        total: '500+',
        label: 'Questões disponíveis'
      },
      features: ['Níveis variados', 'Feedback imediato', 'Gamificação']
    }
  ];

  const handleCardClick = (type) => {
    console.log(`Navegando para: ${type}`);
    
    // Se for quizz, navega para a página de Quizz
    if (type === 'quizz') {
      onNavigate && onNavigate('quizz');
      return;
    }
    
    // Para outros tipos, mostra o MaterialsView
    setCurrentView(type);
  };

  const stats = [
    { value: '1.200+', label: 'Materiais', icon: '📦' },
    { value: '50+', label: 'Categorias', icon: '🗂️' },
    { value: '10k+', label: 'Downloads', icon: '⬇️' },
    { value: '4.8/5', label: 'Avaliação', icon: '⭐' }
  ];

  // Se uma view específica está selecionada, renderiza o MaterialsView
  if (currentView) {
    return (
      <MaterialsView 
        type={currentView}
        onBack={() => setCurrentView(null)}
      />
    );
  }

  return (
    <div className="library" style={{ backgroundColor: colors.background.default }}>
      <div className="library-container">
        {/* Hero Section */}
        <section className="library-hero">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>Centro de Conhecimento</span>
            </div>
            <h1 style={{ color: colors.text.primary }}>
              Biblioteca Digital
            </h1>
            <p style={{ color: colors.text.secondary }}>
              Acesse milhares de recursos educacionais organizados especialmente para você. 
              Apostilas, resumos, mapas mentais e quizzes para potencializar seu aprendizado.
            </p>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="stat-box"
                style={{
                  backgroundColor: colors.background.paper,
                  borderColor: colors.divider,
                }}
              >
                <span className="stat-icon">{stat.icon}</span>
                <div className="stat-content">
                  <div 
                    className="stat-value"
                    style={{ color: colors.primary.main }}
                  >
                    {stat.value}
                  </div>
                  <div 
                    className="stat-label"
                    style={{ color: colors.text.secondary }}
                  >
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Cards Grid */}
        <section className="library-grid">
          {libraryOptions.map((option) => (
            <div
              key={option.id}
              className={`library-card ${hoveredCard === option.id ? 'hovered' : ''}`}
              onClick={() => handleCardClick(option.type)}
              onMouseEnter={() => setHoveredCard(option.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider,
              }}
            >
              {/* Card Header with Gradient */}
              <div 
                className="card-header-gradient"
                style={{ background: option.gradient }}
              >
                <div className="card-icon-wrapper">
                  <span className="card-icon">{option.icon}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="card-content">
                <div className="card-title-section">
                  <h3 style={{ color: colors.text.primary }}>
                    {option.title}
                  </h3>
                  <p 
                    className="card-subtitle"
                    style={{ color: option.color }}
                  >
                    {option.subtitle}
                  </p>
                </div>

                <p 
                  className="card-description"
                  style={{ color: colors.text.secondary }}
                >
                  {option.description}
                </p>

                {/* Stats Badge */}
                <div 
                  className="card-stats"
                  style={{ 
                    backgroundColor: `${option.color}15`,
                    borderColor: `${option.color}40`
                  }}
                >
                  <span 
                    className="stats-value"
                    style={{ color: option.color }}
                  >
                    {option.stats.total}
                  </span>
                  <span 
                    className="stats-label"
                    style={{ color: colors.text.secondary }}
                  >
                    {option.stats.label}
                  </span>
                </div>

                {/* Features List */}
                <ul className="card-features">
                  {option.features.map((feature, index) => (
                    <li 
                      key={index}
                      style={{ color: colors.text.primary }}
                    >
                      <span 
                        className="feature-dot"
                        style={{ backgroundColor: option.color }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <button
                  className="card-button"
                  style={{
                    background: option.gradient,
                    color: '#ffffff'
                  }}
                >
                  <span>Acessar {option.title}</span>
                  <span className="button-arrow">→</span>
                </button>
              </div>

              {/* Decorative Elements */}
              <div className="card-decorative">
                <div 
                  className="decorative-circle circle-1"
                  style={{ backgroundColor: `${option.color}10` }}
                />
                <div 
                  className="decorative-circle circle-2"
                  style={{ backgroundColor: `${option.color}05` }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Benefits Section */}
        <section className="library-benefits">
          <h2 style={{ color: colors.text.primary }}>
            Por que usar nossa Biblioteca?
          </h2>
          
          <div className="benefits-grid">
            <div 
              className="benefit-card"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider,
              }}
            >
              <div className="benefit-icon">🚀</div>
              <h3 style={{ color: colors.text.primary }}>
                Acelere seu Aprendizado
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Materiais organizados e otimizados para maximizar sua absorção de conhecimento
              </p>
            </div>

            <div 
              className="benefit-card"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider,
              }}
            >
              <div className="benefit-icon">💡</div>
              <h3 style={{ color: colors.text.primary }}>
                Conteúdo de Qualidade
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Criado por especialistas e revisado constantemente para garantir a melhor experiência
              </p>
            </div>

            <div 
              className="benefit-card"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider,
              }}
            >
              <div className="benefit-icon">📱</div>
              <h3 style={{ color: colors.text.primary }}>
                Acesse de Qualquer Lugar
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Disponível em todos os dispositivos, com sincronização automática
              </p>
            </div>

            <div 
              className="benefit-card"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider,
              }}
            >
              <div className="benefit-icon">🎓</div>
              <h3 style={{ color: colors.text.primary }}>
                Aprenda no Seu Ritmo
              </h3>
              <p style={{ color: colors.text.secondary }}>
                Estude quando e onde quiser, sem pressão ou limitações de tempo
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section 
          className="library-cta"
          style={{
            background: colors.primary.main,
          }}
        >
          <div className="cta-content">
            <div className="cta-icon">🎉</div>
            <h2 style={{ color: colors.text.white }}>
              Comece Agora Sua Jornada de Aprendizado
            </h2>
            <p style={{ color: colors.text.white }}>
              Explore todo o conteúdo disponível e transforme sua forma de estudar
            </p>
            <button
              className="cta-button"
              style={{
                backgroundColor: colors.text.white,
                color: colors.primary.main,
              }}
            >
              Ver Todos os Materiais
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Library;
