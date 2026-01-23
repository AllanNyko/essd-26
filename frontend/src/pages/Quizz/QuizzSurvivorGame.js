import React, { useState, useEffect } from 'react';
import './QuizzSurvivorGame.css';
import colors from '../../config/colors';

const QuizzSurvivorGame = ({ category, onGameOver, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [streak, setStreak] = useState(0);

  // Banco expandido de perguntas com diferentes dificuldades
  const allQuestions = [
    // Matemática
    { id: 1, category: 'matematica', question: 'Quanto é 15 × 8?', options: ['110', '120', '130', '140'], correct: 1, difficulty: 'easy', timeLimit: 15 },
    { id: 2, category: 'matematica', question: 'Quanto é a raiz quadrada de 144?', options: ['10', '11', '12', '13'], correct: 2, difficulty: 'easy', timeLimit: 15 },
    { id: 3, category: 'matematica', question: 'Qual o valor de π (pi) aproximado?', options: ['3.14', '2.71', '1.41', '4.20'], correct: 0, difficulty: 'easy', timeLimit: 12 },
    { id: 4, category: 'matematica', question: 'Quanto é 25% de 200?', options: ['25', '40', '50', '75'], correct: 2, difficulty: 'medium', timeLimit: 18 },
    { id: 5, category: 'matematica', question: 'Qual é o resultado de 2³ + 3²?', options: ['13', '17', '19', '21'], correct: 1, difficulty: 'medium', timeLimit: 20 },
    
    // Português
    { id: 6, category: 'portugues', question: 'Qual é o plural de "chapéu"?', options: ['Chapéis', 'Chapéus', 'Chapeles', 'Chapéues'], correct: 1, difficulty: 'easy', timeLimit: 10 },
    { id: 7, category: 'portugues', question: 'Qual é o sinônimo de "feliz"?', options: ['Triste', 'Alegre', 'Zangado', 'Cansado'], correct: 1, difficulty: 'easy', timeLimit: 12 },
    { id: 8, category: 'portugues', question: 'Qual é o antônimo de "claro"?', options: ['Escuro', 'Brilhante', 'Limpo', 'Visível'], correct: 0, difficulty: 'easy', timeLimit: 12 },
    { id: 9, category: 'portugues', question: 'Qual palavra está correta?', options: ['Exceção', 'Excessão', 'Eseção', 'Excesão'], correct: 0, difficulty: 'medium', timeLimit: 15 },
    
    // História
    { id: 10, category: 'historia', question: 'Em que ano foi proclamada a independência do Brasil?', options: ['1822', '1889', '1500', '1808'], correct: 0, difficulty: 'easy', timeLimit: 15 },
    { id: 11, category: 'historia', question: 'Quem descobriu o Brasil?', options: ['Cristóvão Colombo', 'Pedro Álvares Cabral', 'Vasco da Gama', 'Fernando de Magalhães'], correct: 1, difficulty: 'easy', timeLimit: 18 },
    { id: 12, category: 'historia', question: 'Qual foi a primeira capital do Brasil?', options: ['Rio de Janeiro', 'São Paulo', 'Salvador', 'Brasília'], correct: 2, difficulty: 'medium', timeLimit: 18 },
    { id: 13, category: 'historia', question: 'Em que ano acabou a Segunda Guerra Mundial?', options: ['1943', '1944', '1945', '1946'], correct: 2, difficulty: 'medium', timeLimit: 20 },
    
    // Geografia
    { id: 14, category: 'geografia', question: 'Qual é a capital da Austrália?', options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correct: 2, difficulty: 'medium', timeLimit: 20 },
    { id: 15, category: 'geografia', question: 'Qual é o maior oceano do mundo?', options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'], correct: 3, difficulty: 'easy', timeLimit: 15 },
    { id: 16, category: 'geografia', question: 'Qual é o rio mais extenso do mundo?', options: ['Nilo', 'Amazonas', 'Yangtzé', 'Mississippi'], correct: 0, difficulty: 'medium', timeLimit: 18 },
    { id: 17, category: 'geografia', question: 'Quantos continentes existem?', options: ['5', '6', '7', '8'], correct: 2, difficulty: 'easy', timeLimit: 12 },
    
    // Ciências
    { id: 18, category: 'ciencias', question: 'Qual é a fórmula química da água?', options: ['H2O', 'CO2', 'O2', 'H2O2'], correct: 0, difficulty: 'easy', timeLimit: 10 },
    { id: 19, category: 'ciencias', question: 'Quantos planetas existem no Sistema Solar?', options: ['7', '8', '9', '10'], correct: 1, difficulty: 'easy', timeLimit: 12 },
    { id: 20, category: 'ciencias', question: 'Qual é o gás mais abundante na atmosfera?', options: ['Oxigênio', 'Nitrogênio', 'Gás Carbônico', 'Hidrogênio'], correct: 1, difficulty: 'medium', timeLimit: 18 },
    { id: 21, category: 'ciencias', question: 'Qual é a velocidade da luz?', options: ['300.000 km/s', '150.000 km/s', '450.000 km/s', '600.000 km/s'], correct: 0, difficulty: 'hard', timeLimit: 20 },
  ];

  // Filtrar e embaralhar perguntas
  const getShuffledQuestions = () => {
    let filtered = category.id === 'mix' 
      ? allQuestions 
      : allQuestions.filter(q => q.category === category.id);
    
    // Embaralhar array
    return filtered.sort(() => Math.random() - 0.5);
  };

  const [shuffledQuestions] = useState(getShuffledQuestions());
  const currentQuestion = shuffledQuestions[currentQuestionIndex % shuffledQuestions.length];

  // Calcular pontos por dificuldade
  const getBasePoints = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 100;
      case 'medium': return 150;
      case 'hard': return 200;
      default: return 100;
    }
  };

  // Inicializar timer quando a pergunta mudar
  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit);
      setIsAnswered(false);
      setIsTimeout(false);
      setSelectedAnswer(null);
    }
  }, [currentQuestionIndex]);

  // Timer
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      handleTimeout();
    }
  }, [timeLeft, isAnswered]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setIsTimeout(true);
    
    // Game Over - timeout
    setTimeout(() => {
      onGameOver({
        score: score,
        questionsAnswered: questionsAnswered,
        streak: streak,
        reason: 'timeout',
        category: category
      });
    }, 2000);
  };

  const handleAnswerClick = (index) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);
    setIsTimeout(false);

    const isCorrect = index === currentQuestion.correct;
    const questionTimeLimit = currentQuestion.timeLimit;
    const timeSpent = questionTimeLimit - timeLeft;
    
    if (isCorrect) {
      // Calcular pontos: base por dificuldade + bônus por velocidade
      const basePoints = getBasePoints(currentQuestion.difficulty);
      const speedBonus = Math.floor((timeLeft / questionTimeLimit) * 50);
      const questionScore = basePoints + speedBonus;
      
      setScore(score + questionScore);
      setQuestionsAnswered(questionsAnswered + 1);
      setStreak(streak + 1);

      setTimeout(() => {
        moveToNextQuestion();
      }, 1500);
    } else {
      // Game Over - resposta errada
      setTimeout(() => {
        onGameOver({
          score: score,
          questionsAnswered: questionsAnswered,
          streak: streak,
          reason: 'wrong_answer',
          category: category
        });
      }, 2000);
    }
  };

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return '';
    }
  };

  return (
    <div className="survivor-game-page" style={{ backgroundColor: colors.background.default }}>
      {/* Header */}
      <div 
        className="survivor-header"
        style={{ backgroundColor: colors.background.paper }}
      >
        <button
          className="exit-button"
          onClick={onExit}
          style={{ color: colors.text.secondary }}
        >
          <span>✕</span>
        </button>

        <div className="survivor-info">
          <div className="survivor-stats">
            <div className="stat-item">
              <span className="stat-label" style={{ color: colors.text.secondary }}>Sequência</span>
              <span className="stat-value" style={{ color: '#ff9800' }}>🔥 {streak}</span>
            </div>
            <div className="stat-divider" style={{ backgroundColor: colors.divider }}></div>
            <div className="stat-item">
              <span className="stat-label" style={{ color: colors.text.secondary }}>Perguntas</span>
              <span className="stat-value" style={{ color: colors.text.primary }}>{questionsAnswered}</span>
            </div>
            <div className="stat-divider" style={{ backgroundColor: colors.divider }}></div>
            <div className="stat-item">
              <span className="stat-label" style={{ color: colors.text.secondary }}>Pontos</span>
              <span className="stat-value" style={{ color: colors.primary.main }}>⭐ {score}</span>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="survivor-warning" style={{ backgroundColor: '#fff3cd' }}>
          <span style={{ color: '#856404' }}>⚠️ <strong>Modo Survivor:</strong> Um único erro e você está fora!</span>
        </div>
      </div>

      {/* Question Area */}
      <div className="survivor-question-container">
        {/* Timer */}
        <div className="timer-section">
          <div 
            className={`timer-circle ${timeLeft <= 10 ? 'warning' : ''}`}
            style={{
              background: timeLeft <= 10 
                ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <span className="timer-value">{timeLeft}</span>
            <span className="timer-label">seg</span>
          </div>
        </div>

        {/* Category & Difficulty */}
        <div className="question-meta">
          <div 
            className="category-badge"
            style={{ 
              backgroundColor: colors.background.paper,
              borderColor: colors.divider 
            }}
          >
            <span className="badge-icon">{category.icon}</span>
            <span style={{ color: colors.text.secondary }}>{category.name}</span>
          </div>

          <div 
            className="difficulty-badge"
            style={{ 
              backgroundColor: `${getDifficultyColor(currentQuestion.difficulty)}20`,
              borderColor: getDifficultyColor(currentQuestion.difficulty),
              color: getDifficultyColor(currentQuestion.difficulty)
            }}
          >
            <span>{getDifficultyLabel(currentQuestion.difficulty)}</span>
            <span className="points-badge">+{getBasePoints(currentQuestion.difficulty)}</span>
          </div>
        </div>

        {/* Question */}
        <div className="question-box">
          <h2 style={{ color: colors.text.primary }}>
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options */}
        <div className="options-grid">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === currentQuestion.correct;
            const showResult = isAnswered;

            let optionClass = 'option-button';
            if (showResult) {
              if (isTimeout) {
                optionClass += ' incorrect';
              } else if (isSelected && isCorrect) {
                optionClass += ' correct';
              } else if (isSelected && !isCorrect) {
                optionClass += ' incorrect';
              }
            } else if (isSelected) {
              optionClass += ' selected';
            }

            return (
              <button
                key={index}
                className={optionClass}
                onClick={() => handleAnswerClick(index)}
                disabled={isAnswered}
                style={{
                  backgroundColor: colors.background.paper,
                  borderColor: colors.divider,
                  color: colors.text.primary
                }}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {showResult && isSelected && isCorrect && !isTimeout && (
                  <span className="result-icon correct-icon">✓</span>
                )}
                {showResult && ((isTimeout) || (isSelected && !isCorrect)) && (
                  <span className="result-icon incorrect-icon">✗</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuizzSurvivorGame;
