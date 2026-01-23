import React from 'react';
import './Home.css';
import colors from '../../config/colors';

const Home = ({ onNavigate }) => {
  const cards = [
    {
      id: 1,
      title: 'Bem-vindo!',
      description: 'Esta é sua aplicação PWA construída com React.',
      icon: '👋'
    },
    {
      id: 2,
      title: 'Funcionalidades',
      description: 'Explore todas as funcionalidades disponíveis no menu lateral.',
      icon: '✨'
    },
    {
      id: 3,
      title: 'Responsivo',
      description: 'Design adaptável para todos os dispositivos.',
      icon: '📱'
    },
    {
      id: 4,
      title: 'Performance',
      description: 'Otimizado para melhor experiência do usuário.',
      icon: '⚡'
    }
  ];

  return (
    <div className="home" style={{ backgroundColor: colors.background.default }}>
      <div className="home-container">
        <section className="hero-section">
          <h1 style={{ color: colors.text.primary }}>
            Bem-vindo ao ESSD App
          </h1>
          <p style={{ color: colors.text.secondary }}>
            Uma aplicação moderna e responsiva construída com React
          </p>
        </section>

        <section className="cards-section">
          <div className="cards-grid">
            {cards.map((card) => (
              <div 
                key={card.id} 
                className="card"
                style={{ 
                  backgroundColor: colors.background.paper,
                  borderColor: colors.divider
                }}
              >
                <div className="card-icon">{card.icon}</div>
                <h3 style={{ color: colors.text.primary }}>{card.title}</h3>
                <p style={{ color: colors.text.secondary }}>{card.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="action-section">
          <button 
            className="primary-button"
            onClick={() => onNavigate && onNavigate('plans')}
            style={{
              backgroundColor: colors.primary.main,
              color: colors.primary.contrastText
            }}
          >
            Ver Planos
          </button>
          <button 
            className="secondary-button"
            onClick={() => onNavigate && onNavigate('about')}
            style={{
              color: colors.primary.main,
              borderColor: colors.primary.main
            }}
          >
            Saber Mais
          </button>
        </section>
      </div>
    </div>
  );
};

export default Home;
