import React, { useState, useEffect } from 'react';
import './QuizzGame.css';
import colors from '../../config/colors';

const QuizzGame = ({ category, onFinish, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Banco de perguntas - será expandido posteriormente
  const questions = [
    {
      id: 1,
      category: 'matematica',
      question: 'Quanto é 15 × 8?',
      options: ['110', '120', '130', '140'],
      correct: 1,
      difficulty: 'easy',
      timeLimit: 15
    },
    {
      id: 2,
      category: 'portugues',
      question: 'Qual é o plural de "chapéu"?',
      options: ['Chapéis', 'Chapéus', 'Chapeles', 'Chapéues'],
      correct: 1,
      difficulty: 'easy',
      timeLimit: 10
    },
    {
      id: 3,
      category: 'historia',
      question: 'Em que ano foi proclamada a independência do Brasil?',
      options: ['1822', '1889', '1500', '1808'],
      correct: 0,
      difficulty: 'easy',
      timeLimit: 15
    },
    {
      id: 4,
      category: 'geografia',
      question: 'Qual é a capital da Austrália?',
      options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
      correct: 2,
      difficulty: 'medium',
      timeLimit: 20
    },
    {
      id: 5,
      category: 'ciencias',
      question: 'Qual é a fórmula química da água?',
      options: ['H2O', 'CO2', 'O2', 'H2O2'],
      correct: 0,
      difficulty: 'easy',
      timeLimit: 10
    },
    {
      id: 6,
      category: 'matematica',
      question: 'Quanto é a raiz quadrada de 144?',
      options: ['10', '11', '12', '13'],
      correct: 2,
      difficulty: 'easy',
      timeLimit: 15
    },
    {
      id: 7,
      category: 'portugues',
      question: 'Qual é o sinônimo de "feliz"?',
      options: ['Triste', 'Alegre', 'Zangado', 'Cansado'],
      correct: 1,
      difficulty: 'easy',
      timeLimit: 12
    },
    {
      id: 8,
      category: 'historia',
      question: 'Quem descobriu o Brasil?',
      options: ['Cristóvão Colombo', 'Pedro Álvares Cabral', 'Vasco da Gama', 'Fernando de Magalhães'],
      correct: 1,
      difficulty: 'easy',
      timeLimit: 18
    },
    {
      id: 9,
      category: 'geografia',
      question: 'Qual é o maior oceano do mundo?',
      options: ['Atlântico', 'Índico', 'Ártico', 'Pacífico'],
      correct: 3,
      difficulty: 'easy',
      timeLimit: 15
    },
    {
      id: 10,
      category: 'ciencias',
      question: 'Quantos planetas existem no Sistema Solar?',
      options: ['7', '8', '9', '10'],
      correct: 1,
      difficulty: 'easy',
      timeLimit: 12
    }
  ];

  // Filtrar perguntas de acordo com a categoria selecionada
  const filteredQuestions = category.id === 'mix' 
    ? questions 
    : questions.filter(q => q.category === category.id).slice(0, 10);

  // Se não houver perguntas suficientes, completar com outras
  const gameQuestions = filteredQuestions.length >= 10 
    ? filteredQuestions.slice(0, 10)
    : [...filteredQuestions, ...questions.slice(0, 10 - filteredQuestions.length)];

  // Inicializar timer quando a pergunta mudar
  useEffect(() => {
    if (gameQuestions[currentQuestion]) {
      setTimeLeft(gameQuestions[currentQuestion].timeLimit);
      setIsAnswered(false);
      setIsTimeout(false);
      setSelectedAnswer(null);
    }
  }, [currentQuestion]);

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
    const questionTimeLimit = gameQuestions[currentQuestion].timeLimit;
    setAnswers([...answers, {
      questionId: gameQuestions[currentQuestion].id,
      selectedAnswer: null,
      correct: false,
      timeSpent: questionTimeLimit
    }]);
    
    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const handleAnswerClick = (index) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);
    setIsTimeout(false);

    const isCorrect = index === gameQuestions[currentQuestion].correct;
    const questionTimeLimit = gameQuestions[currentQuestion].timeLimit;
    const timeSpent = questionTimeLimit - timeLeft;
    
    // Calcular pontos: 100 pontos base + bônus por velocidade
    if (isCorrect) {
      const speedBonus = Math.floor((timeLeft / questionTimeLimit) * 50);
      const questionScore = 100 + speedBonus;
      setScore(score + questionScore);
    }

    setAnswers([...answers, {
      questionId: gameQuestions[currentQuestion].id,
      selectedAnswer: index,
      correct: isCorrect,
      timeSpent: timeSpent
    }]);

    setTimeout(() => {
      moveToNextQuestion();
    }, 2000);
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < gameQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Todos os estados serão resetados pelo useEffect quando currentQuestion mudar
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    onFinish({
      score: score,
      answers: answers,
      totalQuestions: gameQuestions.length,
      category: category
    });
  };

  const question = gameQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / gameQuestions.length) * 100;

  return (
    <div className="quizz-game-page" style={{ backgroundColor: colors.background.default }}>
      {/* Header */}
      <div 
        className="game-header"
        style={{ backgroundColor: colors.background.paper }}
      >
        <button
          className="exit-button"
          onClick={onExit}
          style={{ color: colors.text.secondary }}
        >
          <span>✕</span>
        </button>

        <div className="game-info">
          <div className="question-counter" style={{ color: colors.text.primary }}>
            <span className="current">{currentQuestion + 1}</span>
            <span className="divider">/</span>
            <span className="total">{gameQuestions.length}</span>
          </div>
          
          <div className="score-display" style={{ color: colors.primary.main }}>
            <span className="score-icon">⭐</span>
            <span className="score-value">{score}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div 
          className="progress-bar-container"
          style={{ backgroundColor: colors.divider }}
        >
          <div 
            className="progress-bar-fill"
            style={{ 
              width: `${progress}%`,
              backgroundColor: colors.primary.main 
            }}
          />
        </div>
      </div>

      {/* Question Area */}
      <div className="question-container">
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

        {/* Category Badge */}
        <div 
          className="category-badge"
          style={{ 
            backgroundColor: colors.background.paper,
            borderColor: colors.divider 
          }}
        >
        {/*  <span className="badge-icon">{category.icon}</span> */}
          <span style={{ color: colors.text.secondary }}>{category.name}</span>
        </div>

        {/* Question */}
        <div className="question-box">
          <h2 style={{ color: colors.text.primary }}>
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="options-grid">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correct;
            const showResult = isAnswered;

            let optionClass = 'option-button';
            if (showResult) {
              // Se foi timeout, mostrar todas como incorretas
              if (isTimeout) {
                optionClass += ' incorrect';
              }
              // Se o usuário acertou, mostrar apenas a selecionada como correta
              else if (isSelected && isCorrect) {
                optionClass += ' correct';
              }
              // Se o usuário errou, mostrar apenas a selecionada como incorreta (NÃO mostrar a correta)
              else if (isSelected && !isCorrect) {
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
                {/* Mostrar ícone de correto apenas se o usuário selecionou e acertou */}
                {showResult && isSelected && isCorrect && !isTimeout && (
                  <span className="result-icon correct-icon">✓</span>
                )}
                {/* Mostrar ícone de incorreto se foi timeout (todas) ou se selecionou errado */}
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

export default QuizzGame;
