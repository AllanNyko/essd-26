import React, { useState } from 'react';
import './Quizz.css';
import colors from '../../config/colors';
import QuizzCategorySelection from './QuizzCategorySelection';
import QuizzPreparationModal from './QuizzPreparationModal';
import QuizzGame from './QuizzGame';
import QuizzSurvivorGame from './QuizzSurvivorGame';
import QuizzResults from './QuizzResults';

const Quizz = ({ onNavigate }) => {
  const [gameState, setGameState] = useState('menu'); // menu, category-selection, preparation, playing, results
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameResults, setGameResults] = useState(null);
  
  // TODO: Integrar com sistema de autenticação real
  const userName = 'Allan'; // Nome do usuário - será substituído por dados reais de autenticação

  const gameModes = [
    {
      id: 'individual',
      name: 'Modo Individual',
      description: 'Jogue sozinho e teste seus conhecimentos',
      icon: '🎯',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      stats: { players: '1', time: '10-15 min', difficulty: 'Fácil' }
    },
    {
      id: 'desafio',
      name: 'Modo Desafio',
      description: 'Desafie outros jogadores em tempo real',
      icon: '⚔️',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      stats: { players: '1v1', time: '5-10 min', difficulty: 'Médio' }
    },
    {
      id: 'grupo',
      name: 'Modo Grupo',
      description: 'Jogue com amigos em equipe',
      icon: '👥',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      stats: { players: '2-8', time: '15-20 min', difficulty: 'Variável' }
    },
    {
      id: 'survivor',
      name: 'Modo Survivor',
      description: 'Sobreviva o máximo de rodadas possível',
      icon: '🔥',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      stats: { players: '1+', time: 'Ilimitado', difficulty: 'Difícil' }
    }
  ];

  const handleModeClick = (mode) => {
    console.log(`Modo selecionado: ${mode.name}`);
    setSelectedMode(mode);
    
    // Para modo individual e survivor, ir para seleção de categoria
    if (mode.id === 'individual' || mode.id === 'survivor') {
      setGameState('category-selection');
    } else {
      // Outros modos serão implementados depois
      alert(`${mode.name} será implementado em breve!`);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setGameState('preparation');
  };

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleGameFinish = (results) => {
    setGameResults(results);
    setGameState('results');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setSelectedMode(null);
    setSelectedCategory(null);
    setGameResults(null);
  };

  const handlePlayAgain = () => {
    setGameState('category-selection');
    setGameResults(null);
  };

  const handleBackToCategories = () => {
    setGameState('category-selection');
  };

  // Renderizar tela de acordo com o estado
  if (gameState === 'category-selection') {
    return (
      <QuizzCategorySelection 
        onSelectCategory={handleCategorySelect}
        onBack={handleBackToMenu}
      />
    );
  }

  if (gameState === 'playing') {
    // Renderizar o jogo apropriado dependendo do modo
    if (selectedMode?.id === 'survivor') {
      return (
        <QuizzSurvivorGame 
          category={selectedCategory}
          onGameOver={handleGameFinish}
          onExit={handleBackToMenu}
        />
      );
    } else {
      return (
        <QuizzGame 
          category={selectedCategory}
          onFinish={handleGameFinish}
          onExit={handleBackToMenu}
        />
      );
    }
  }

  if (gameState === 'results') {
    return (
      <QuizzResults 
        results={gameResults}
        mode={selectedMode?.id}
        onPlayAgain={handlePlayAgain}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  const achievements = [
    { icon: '🏆', value: '2.5k+', label: 'Partidas Jogadas' },
    { icon: '⭐', value: '1.8k+', label: 'Jogadores Ativos' },
    { icon: '🎖️', value: '500+', label: 'Quizzes Disponíveis' },
    { icon: '👑', value: '4.9/5', label: 'Avaliação' }
  ];

  return (
    <div className="quizz-page" style={{ backgroundColor: colors.background.default }}>
      {/* Hero Section */}
      <section className="quizz-hero">
        <div className="hero-background">
          <div className="hero-overlay" />
          <div className="floating-icons">
            <span className="float-icon">💡</span>
            <span className="float-icon">🎮</span>
            <span className="float-icon">🧠</span>
            <span className="float-icon">✨</span>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🎲</span>
            <span>Aprenda Jogando</span>
          </div>
          <h1 style={{ color: colors.text.white }}>
            Quiz Game
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Escolha seu modo de jogo favorito e teste seus conhecimentos de forma divertida e interativa
          </p>
        </div>

        {/* Achievements */}
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="achievement-card"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span className="achievement-icon">{achievement.icon}</span>
              <div className="achievement-content">
                <div className="achievement-value" style={{ color: colors.text.white }}>
                  {achievement.value}
                </div>
                <div className="achievement-label" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {achievement.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="game-modes-section">
        <div className="section-header">
          <h2 style={{ color: colors.text.primary }}>
            Escolha Seu Modo de Jogo
          </h2>
          <p style={{ color: colors.text.secondary }}>
            Cada modo oferece uma experiência única de aprendizado
          </p>
        </div>

        <div className="game-modes-grid">
          {gameModes.map((mode) => (
            <div
              key={mode.id}
              className="game-mode-card"
              onClick={() => handleModeClick(mode)}
              style={{
                background: mode.gradient,
              }}
            >
              <div className="mode-overlay" />
              
              <div className="mode-content">
                <div className="mode-icon">{mode.icon}</div>
                <h3 className="mode-name">{mode.name}</h3>
                <p className="mode-description">{mode.description}</p>
                
                <div className="mode-stats">
                  <div className="stat">
                    <span className="stat-label">Jogadores</span>
                    <span className="stat-value">{mode.stats.players}</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat">
                    <span className="stat-label">Duração</span>
                    <span className="stat-value">{mode.stats.time}</span>
                  </div>
                  <div className="stat-divider" />
                  <div className="stat">
                    <span className="stat-label">Dificuldade</span>
                    <span className="stat-value">{mode.stats.difficulty}</span>
                  </div>
                </div>

                <div className="play-button">
                  <span>Jogar Agora</span>
                  <span className="arrow">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <div 
          className="info-card"
          style={{
            backgroundColor: colors.background.paper,
            borderColor: colors.divider,
          }}
        >
          <div className="info-icon">💡</div>
          <h3 style={{ color: colors.text.primary }}>Como Funciona?</h3>
          <p style={{ color: colors.text.secondary }}>
            Selecione um modo de jogo, escolha a categoria de perguntas e comece a jogar. 
            Responda corretamente para ganhar pontos e subir no ranking!
          </p>
        </div>

        <div 
          className="info-card"
          style={{
            backgroundColor: colors.background.paper,
            borderColor: colors.divider,
          }}
        >
          <div className="info-icon">🎯</div>
          <h3 style={{ color: colors.text.primary }}>Ganhe Recompensas</h3>
          <p style={{ color: colors.text.secondary }}>
            Complete desafios diários, conquiste troféus e desbloqueie novos avatares 
            enquanto aprende de forma divertida.
          </p>
        </div>

        <div 
          className="info-card"
          style={{
            backgroundColor: colors.background.paper,
            borderColor: colors.divider,
          }}
        >
          <div className="info-icon">📊</div>
          <h3 style={{ color: colors.text.primary }}>Acompanhe Seu Progresso</h3>
          <p style={{ color: colors.text.secondary }}>
            Veja estatísticas detalhadas do seu desempenho, identifique pontos de melhoria 
            e acompanhe sua evolução ao longo do tempo.
          </p>
        </div>
      </section>

      {/* Modal de Preparação */}
      {gameState === 'preparation' && selectedCategory && (
        <QuizzPreparationModal 
          category={selectedCategory}
          userName={userName}
          onStart={handleStartGame}
          onCancel={handleBackToCategories}
        />
      )}
    </div>
  );
};

export default Quizz;
