import React from 'react';
import './QuizzResults.css';
import colors from '../../config/colors';

const QuizzResults = ({ results, mode, onPlayAgain, onBackToMenu, userStats }) => {
  const { score, answers, totalQuestions, category, questionsAnswered, streak, reason } = results;
  
  // Estatísticas do usuário (virão do banco de dados)
  // TODO: Integrar com API/banco de dados real
  const overallStats = userStats || {
    bestStreak: 15, // Maior sequência de acertos
    totalCorrect: 245, // Total de acertos em todos os quizzes
    totalWrong: 55, // Total de erros em todos os quizzes
    overallAccuracy: Math.round((245 / (245 + 55)) * 100) // Taxa de acerto geral
  };

  // Calcular estatísticas
  const correctAnswers = answers?.filter(a => a.correct).length || questionsAnswered || 0;
  const wrongAnswers = mode === 'survivor' ? 1 : (totalQuestions - correctAnswers);
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 
                   questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;

  // Determinar performance
  const getPerformance = () => {
    if (mode === 'survivor') {
      if (questionsAnswered >= 20) return { level: 'Lendário', emoji: '👑', color: '#ffd700' };
      if (questionsAnswered >= 15) return { level: 'Excelente', emoji: '🏆', color: '#10b981' };
      if (questionsAnswered >= 10) return { level: 'Ótimo', emoji: '⭐', color: '#3b82f6' };
      if (questionsAnswered >= 5) return { level: 'Bom', emoji: '👍', color: '#8b5cf6' };
      return { level: 'Continue Tentando', emoji: '💪', color: '#f59e0b' };
    } else {
      if (accuracy >= 90) return { level: 'Excelente', emoji: '🏆', color: '#10b981' };
      if (accuracy >= 70) return { level: 'Muito Bom', emoji: '⭐', color: '#3b82f6' };
      if (accuracy >= 50) return { level: 'Bom', emoji: '👍', color: '#8b5cf6' };
      return { level: 'Continue Praticando', emoji: '💪', color: '#f59e0b' };
    }
  };

  const performance = getPerformance();

  // Mensagem de encerramento para Survivor
  const getSurvivorEndMessage = () => {
    if (reason === 'timeout') {
      return { text: 'O tempo acabou!', icon: '⏰' };
    } else if (reason === 'wrong_answer') {
      return { text: 'Resposta incorreta!', icon: '❌' };
    }
    return { text: 'Fim de jogo!', icon: '🎮' };
  };

  const survivorEnd = getSurvivorEndMessage();

  return (
    <div className="results-page" style={{ backgroundColor: colors.background.default }}>
      <div className="results-container">
        {/* Header com Performance */}
        <div 
          className="results-header"
          style={{ 
            background: `linear-gradient(135deg, ${performance.color}20 0%, ${performance.color}10 100%)`,
            borderColor: performance.color
          }}
        >
          <div className="performance-badge" style={{ color: performance.color }}>
            <span className="performance-emoji">{performance.emoji}</span>
            <h2>{performance.level}</h2>
          </div>
          
          {mode === 'survivor' && (
            <div className="survivor-end-message" style={{ color: colors.text.secondary }}>
              <span className="end-icon">{survivorEnd.icon}</span>
              <span>{survivorEnd.text}</span>
            </div>
          )}
        </div>

        {/* Score Principal */}
        <div 
          className="main-score"
          style={{ backgroundColor: colors.background.paper }}
        >
          <div className="score-label" style={{ color: colors.text.secondary }}>
            Pontuação Final
          </div>
          <div className="score-value" style={{ color: colors.primary.main }}>
            {score.toLocaleString()}
          </div>
          <div className="score-subtitle" style={{ color: colors.text.secondary }}>
            pontos
          </div>
        </div>

        {/* Estatísticas */}
        <div className={`stats-grid ${mode === 'survivor' ? 'survivor-grid' : ''}`}>
          <div 
            className="stat-card"
            style={{ backgroundColor: colors.background.paper }}
          >
            <div className="stat-icon correct">✓</div>
            <div className="stat-content">
              <div className="stat-value" style={{ color: '#10b981' }}>
                {correctAnswers}
              </div>
              <div className="stat-label" style={{ color: colors.text.secondary }}>
                {mode === 'survivor' ? 'Acertos Consecutivos' : 'Acertos'}
              </div>
            </div>
          </div>

          {mode !== 'survivor' && (
            <>
              <div 
                className="stat-card"
                style={{ backgroundColor: colors.background.paper }}
              >
                <div className="stat-icon incorrect">✗</div>
                <div className="stat-content">
                  <div className="stat-value" style={{ color: '#ef4444' }}>
                    {wrongAnswers}
                  </div>
                  <div className="stat-label" style={{ color: colors.text.secondary }}>
                    Erros
                  </div>
                </div>
              </div>

              <div 
                className="stat-card"
                style={{ backgroundColor: colors.background.paper }}
              >
                <div className="stat-icon accuracy">📊</div>
                <div className="stat-content">
                  <div className="stat-value" style={{ color: colors.primary.main }}>
                    {accuracy}%
                  </div>
                  <div className="stat-label" style={{ color: colors.text.secondary }}>
                    Precisão
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Estatísticas Gerais do Usuário */}
        <div className="overall-stats-section">
          <h3 className="section-title" style={{ color: colors.text.primary }}>
            📊 Suas Estatísticas Gerais
          </h3>
          <div className="overall-stats-grid">
            <div 
              className="overall-stat-card"
              style={{ backgroundColor: colors.background.paper }}
            >
              <div className="overall-stat-icon best-streak">🏆</div>
              <div className="overall-stat-content">
                <div className="overall-stat-value" style={{ color: '#ffd700' }}>
                  {overallStats.bestStreak}
                </div>
                <div className="overall-stat-label" style={{ color: colors.text.secondary }}>
                  Melhor Sequência
                </div>
              </div>
            </div>

            <div 
              className="overall-stat-card"
              style={{ backgroundColor: colors.background.paper }}
            >
              <div className="overall-stat-icon accuracy-rate">📈</div>
              <div className="overall-stat-content">
                <div className="overall-stat-value" style={{ color: '#10b981' }}>
                  {overallStats.overallAccuracy}%
                </div>
                <div className="overall-stat-label" style={{ color: colors.text.secondary }}>
                  Taxa de Acertos
                </div>
                <div className="overall-stat-detail" style={{ color: colors.text.hint }}>
                  {overallStats.totalCorrect} acertos / {overallStats.totalWrong} erros
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informação da Categoria */}
        <div 
          className="category-info-card"
          style={{ 
            backgroundColor: colors.background.paper,
            borderColor: colors.divider
          }}
        >
          <span className="category-icon-large">{category.icon}</span>
          <div className="category-details">
            <h3 style={{ color: colors.text.primary }}>
              {category.name}
            </h3>
            <p style={{ color: colors.text.secondary }}>
              {mode === 'survivor' ? 'Modo Survivor' : 'Modo Individual'} • 
              {mode === 'survivor' 
                ? ` ${questionsAnswered} pergunta${questionsAnswered !== 1 ? 's' : ''} respondida${questionsAnswered !== 1 ? 's' : ''}`
                : ` ${totalQuestions} perguntas`
              }
            </p>
          </div>
        </div>

        {/* Mensagem Motivacional */}
        <div 
          className="motivation-message"
          style={{ 
            backgroundColor: `${performance.color}15`,
            borderColor: `${performance.color}40`
          }}
        >
          <p style={{ color: colors.text.primary }}>
            {getMotivationalMessage(performance.level, mode, questionsAnswered)}
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="results-actions">
          <button
            className="secondary-button"
            onClick={onBackToMenu}
            style={{
              backgroundColor: 'transparent',
              color: colors.text.primary,
              border: `2px solid ${colors.divider}`
            }}
          >
            <span>Voltar ao Menu</span>
          </button>
          <button
            className="primary-button"
            onClick={onPlayAgain}
            style={{
              backgroundColor: colors.primary.main,
              color: colors.text.white
            }}
          >
            <span>Jogar Novamente</span>
            <span className="button-icon">🎮</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Mensagens motivacionais baseadas na performance
const getMotivationalMessage = (level, mode, questionsAnswered) => {
  if (mode === 'survivor') {
    if (level === 'Lendário') return '🎉 Incrível! Você é uma verdadeira lenda do quiz!';
    if (level === 'Excelente') return '🌟 Performance excepcional! Continue assim!';
    if (level === 'Ótimo') return '💪 Muito bem! Você está dominando!';
    if (level === 'Bom') return '👏 Bom trabalho! Continue praticando para melhorar!';
    return '🎯 Todo começo é difícil. Tente novamente!';
  } else {
    if (level === 'Excelente') return '🏆 Perfeito! Seu conhecimento é impressionante!';
    if (level === 'Muito Bom') return '⭐ Ótimo resultado! Você está no caminho certo!';
    if (level === 'Bom') return '👍 Bom trabalho! Continue estudando para melhorar!';
    return '📚 Continue praticando! Cada erro é uma oportunidade de aprender!';
  }
};

export default QuizzResults;
