import React from 'react';
import './About.css';
import colors from '../../config/colors';

const About = () => {
  const stats = [
    { id: 1, value: '10k+', label: 'Usuários Ativos', icon: '👥' },
    { id: 2, value: '50k+', label: 'Projetos Criados', icon: '📊' },
    { id: 3, value: '99.9%', label: 'Uptime', icon: '⚡' },
    { id: 4, value: '24/7', label: 'Suporte', icon: '💬' }
  ];

  const values = [
    {
      id: 1,
      icon: '🎯',
      title: 'Foco no Cliente',
      description: 'Colocamos nossos clientes no centro de tudo que fazemos, ouvindo feedback e melhorando constantemente.'
    },
    {
      id: 2,
      icon: '🚀',
      title: 'Inovação',
      description: 'Buscamos sempre as melhores tecnologias e práticas para entregar soluções modernas e eficientes.'
    },
    {
      id: 3,
      icon: '🤝',
      title: 'Transparência',
      description: 'Mantemos comunicação clara e honesta com nossos clientes, sem surpresas ou custos ocultos.'
    },
    {
      id: 4,
      icon: '💪',
      title: 'Excelência',
      description: 'Comprometidos em entregar produtos e serviços de alta qualidade que superam expectativas.'
    }
  ];

  const team = [
    {
      id: 1,
      name: 'Ana Silva',
      role: 'CEO & Fundadora',
      avatar: '👩‍💼',
      description: 'Visionária com 15 anos de experiência em tecnologia'
    },
    {
      id: 2,
      name: 'Carlos Santos',
      role: 'CTO',
      avatar: '👨‍💻',
      description: 'Especialista em arquitetura de software e cloud'
    },
    {
      id: 3,
      name: 'Mariana Costa',
      role: 'Head de Design',
      avatar: '👩‍🎨',
      description: 'Designer premiada com foco em UX/UI'
    },
    {
      id: 4,
      name: 'Pedro Lima',
      role: 'Head de Produto',
      avatar: '👨‍💼',
      description: 'Estrategista de produto com MBA em inovação'
    }
  ];

  const timeline = [
    { id: 1, year: '2020', title: 'Fundação', description: 'Iniciamos com uma ideia e muita determinação' },
    { id: 2, year: '2021', title: 'Primeiro MVP', description: 'Lançamento da primeira versão do produto' },
    { id: 3, year: '2022', title: '1.000 Usuários', description: 'Alcançamos nossa primeira meta importante' },
    { id: 4, year: '2023', title: 'Expansão', description: 'Abertura de novo escritório e contratações' },
    { id: 5, year: '2024', title: '10.000 Usuários', description: 'Crescimento exponencial da base de clientes' },
    { id: 6, year: '2025', title: 'Reconhecimento', description: 'Premiação como melhor startup do ano' }
  ];

  return (
    <div className="about" style={{ backgroundColor: colors.background.default }}>
      <div className="about-container">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-badge" style={{ backgroundColor: colors.primary.main }}>
            <span style={{ color: colors.text.white }}>✨ Sobre Nós</span>
          </div>
          <h1 style={{ color: colors.text.primary }}>
            Transformando Ideias em Realidade
          </h1>
          <p className="hero-subtitle" style={{ color: colors.text.secondary }}>
            Somos uma equipe apaixonada por tecnologia e inovação, dedicada a criar soluções 
            que fazem a diferença na vida das pessoas e empresas.
          </p>
        </section>

        {/* Stats */}
        <section className="about-stats">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="stat-item"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider,
              }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value" style={{ color: colors.primary.main }}>
                {stat.value}
              </div>
              <div className="stat-label" style={{ color: colors.text.secondary }}>
                {stat.label}
              </div>
            </div>
          ))}
        </section>

        {/* Mission */}
        <section className="about-mission">
          <div 
            className="mission-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="mission-icon">🎯</div>
            <h2 style={{ color: colors.text.primary }}>Nossa Missão</h2>
            <p style={{ color: colors.text.secondary }}>
              Capacitar pessoas e empresas através de tecnologia inovadora, proporcionando 
              ferramentas simples, poderosas e acessíveis que otimizam processos e impulsionam 
              resultados extraordinários.
            </p>
          </div>

          <div 
            className="mission-card"
            style={{
              backgroundColor: colors.background.paper,
              borderColor: colors.divider,
            }}
          >
            <div className="mission-icon">👁️</div>
            <h2 style={{ color: colors.text.primary }}>Nossa Visão</h2>
            <p style={{ color: colors.text.secondary }}>
              Ser referência global em soluções tecnológicas, reconhecidos pela excelência, 
              inovação e impacto positivo na vida de milhões de usuários ao redor do mundo.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="about-values">
          <h2 className="section-title" style={{ color: colors.text.primary }}>
            Nossos Valores
          </h2>
          <div className="values-grid">
            {values.map((value) => (
              <div
                key={value.id}
                className="value-card"
                style={{
                  backgroundColor: colors.background.paper,
                  borderColor: colors.divider,
                }}
              >
                <div className="value-icon">{value.icon}</div>
                <h3 style={{ color: colors.text.primary }}>{value.title}</h3>
                <p style={{ color: colors.text.secondary }}>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="about-timeline">
          <h2 className="section-title" style={{ color: colors.text.primary }}>
            Nossa Jornada
          </h2>
          <div className="timeline">
            {timeline.map((item, index) => (
              <div key={item.id} className="timeline-item">
                <div 
                  className="timeline-marker"
                  style={{ backgroundColor: colors.primary.main }}
                />
                {index < timeline.length - 1 && (
                  <div 
                    className="timeline-line"
                    style={{ backgroundColor: colors.divider }}
                  />
                )}
                <div 
                  className="timeline-content"
                  style={{
                    backgroundColor: colors.background.paper,
                    borderColor: colors.divider,
                  }}
                >
                  <div 
                    className="timeline-year"
                    style={{ color: colors.primary.main }}
                  >
                    {item.year}
                  </div>
                  <h3 style={{ color: colors.text.primary }}>{item.title}</h3>
                  <p style={{ color: colors.text.secondary }}>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="about-team">
          <h2 className="section-title" style={{ color: colors.text.primary }}>
            Conheça Nosso Time
          </h2>
          <div className="team-grid">
            {team.map((member) => (
              <div
                key={member.id}
                className="team-card"
                style={{
                  backgroundColor: colors.background.paper,
                  borderColor: colors.divider,
                }}
              >
                <div className="team-avatar">{member.avatar}</div>
                <h3 style={{ color: colors.text.primary }}>{member.name}</h3>
                <div 
                  className="team-role"
                  style={{ color: colors.primary.main }}
                >
                  {member.role}
                </div>
                <p style={{ color: colors.text.secondary }}>{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <div 
            className="cta-card"
            style={{
              backgroundColor: colors.primary.main,
            }}
          >
            <h2 style={{ color: colors.text.white }}>
              Vamos Trabalhar Juntos?
            </h2>
            <p style={{ color: colors.text.white, opacity: 0.9 }}>
              Estamos sempre em busca de talentos excepcionais e parceiros estratégicos
            </p>
            <div className="cta-buttons">
              <button 
                className="cta-button primary"
                style={{
                  backgroundColor: colors.text.white,
                  color: colors.primary.main,
                }}
              >
                Ver Vagas
              </button>
              <button 
                className="cta-button secondary"
                style={{
                  borderColor: colors.text.white,
                  color: colors.text.white,
                }}
              >
                Seja Parceiro
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
