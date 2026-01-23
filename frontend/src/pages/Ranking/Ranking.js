import React from 'react';
import colors from '../../config/colors';
import './Ranking.css';

function Ranking() {
  // Dados mock do usuário atual
  const currentUser = {
    id: 1,
    firstName: 'João',
    lastName: 'Silva',
    position: 15,
    avatar: 'https://i.pravatar.cc/150?img=12',
    points: 2450
  };

  // Dados mock do ranking
  const rankingList = [
    { id: 2, name: 'Maria Santos', position: 1, average: 9.7, avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Pedro Costa', position: 2, average: 9.4, avatar: 'https://i.pravatar.cc/150?img=13' },
    { id: 4, name: 'Ana Oliveira', position: 3, average: 9.2, avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 5, name: 'Carlos Souza', position: 4, average: 8.9, avatar: 'https://i.pravatar.cc/150?img=7' },
    { id: 6, name: 'Juliana Lima', position: 5, average: 8.7, avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: 7, name: 'Rafael Alves', position: 6, average: 8.5, avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 8, name: 'Beatriz Rocha', position: 7, average: 8.3, avatar: 'https://i.pravatar.cc/150?img=16' },
    { id: 9, name: 'Lucas Martins', position: 8, average: 8.1, avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: 10, name: 'Fernanda Dias', position: 9, average: 7.9, avatar: 'https://i.pravatar.cc/150?img=10' },
    { id: 11, name: 'Gabriel Nunes', position: 10, average: 7.7, avatar: 'https://i.pravatar.cc/150?img=14' },
  ];

  return (
    <div className="ranking-page">
      <div className="ranking-header">
        <h1 style={{ color: colors.text.primary }}>Ranking</h1>
        <p style={{ color: colors.text.secondary }}>Veja sua posição e compete com outros estudantes</p>
      </div>

      {/* Card do usuário atual */}
      <div 
        className="current-user-card"
        style={{
          backgroundColor: colors.background.paper,
          border: `2px solid ${colors.primary.main}`
        }}
      >
        <div className="user-avatar-wrapper">
          <img 
            src={currentUser.avatar} 
            alt={`${currentUser.firstName} ${currentUser.lastName}`}
            className="user-avatar"
          />
        </div>
        <div className="user-info">
          <h2 style={{ color: colors.text.primary }}>
            {currentUser.firstName} {currentUser.lastName}
          </h2>
          <p style={{ color: colors.text.secondary }}>
            {currentUser.points} pontos
          </p>
        </div>
        <div className="user-position">
          <span 
            className="position-hash"
            style={{ color: colors.primary.main }}
          >
            #
          </span>
          <span 
            className="position-number"
            style={{ color: colors.primary.main }}
          >
            {currentUser.position}
          </span>
        </div>
      </div>

      {/* Lista do ranking */}
      <div className="ranking-section">
        <h3 style={{ color: colors.text.primary }}>Ranking geral</h3>
        
        <div className="ranking-list">
          {rankingList.map((user) => (
            <div 
              key={user.id}
              className="ranking-item"
              style={{
                backgroundColor: colors.background.paper,
                borderColor: colors.divider
              }}
            >
              <div className="ranking-position-badge" style={{
                color: colors.text.primary
              }}>
                #{user.position}
              </div>
              
              <div className="ranking-avatar-wrapper">
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="ranking-avatar"
                />
              </div>
              
              <div className="ranking-info">
                <h4 style={{ color: colors.text.primary }}>{user.name}</h4>
                <p style={{ color: colors.text.secondary }}>Média geral</p>
              </div>

              <div className="ranking-average">
                <span className="average-label" style={{ color: colors.text.secondary }}>
                  Média
                </span>
                <span className="average-value" style={{ color: colors.text.primary }}>
                  {user.average.toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Ranking;
