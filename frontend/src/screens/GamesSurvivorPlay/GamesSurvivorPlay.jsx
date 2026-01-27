import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './GamesSurvivorPlay.css'

const GamesSurvivorPlay = () => {
  const navigate = useNavigate()
  const [showIntro, setShowIntro] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState([])
  const [timeLeft, setTimeLeft] = useState(20)
  const [locked, setLocked] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [result, setResult] = useState('')
  const [timedOut, setTimedOut] = useState(false)
  const [answeredIds, setAnsweredIds] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const timeoutHandled = useRef(false)
  const [resettingTimer, setResettingTimer] = useState(false)
  const timerRef = useRef(null)
  const sessionRef = useRef(null)
  const [userStats, setUserStats] = useState({ hits: 0, errors: 0, points: 0 })

  const loadQuiz = async (excludeIds = []) => {
    setLoading(true)
    try {
      const storedSubjects = localStorage.getItem('essd_game_subjects')
      const subjectIds = storedSubjects ? JSON.parse(storedSubjects) : []
      const params = new URLSearchParams()
      if (subjectIds.length > 0) {
        params.set('subject_ids', subjectIds.join(','))
      }
      if (excludeIds.length > 0) {
        params.set('exclude_ids', excludeIds.join(','))
      }
      const query = params.toString() ? `?${params.toString()}` : ''

      const response = await fetch(`${API_BASE_URL}/quizzes/play/next${query}`, {
        headers: { 'Accept': 'application/json' },
      })
      const data = await parseJson(response)
      const nextQuiz = data?.quiz || null

      const lastQuizId = Number(localStorage.getItem('essd_last_quiz_id') || 0)
      const shouldRetry =
        nextQuiz?.id &&
        lastQuizId &&
        nextQuiz.id === lastQuizId &&
        excludeIds.length === 0

      if (shouldRetry) {
        await loadQuiz([lastQuizId])
        return
      }

      setQuiz(nextQuiz)
    } finally {
      setLoading(false)
    }
  }

  const registerSession = async (nextQuiz) => {
    const storedUser = localStorage.getItem('essd_user')
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    const userId = currentUser?.id

    if (!nextQuiz?.id || !userId) {
      return
    }

    await fetch(`${API_BASE_URL}/game-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        user_id: Number(userId),
        quiz_id: nextQuiz.id,
        mode: 'survivor',
        time_left: 20,
      }),
    })

    sessionRef.current = {
      userId: Number(userId),
      quizId: nextQuiz.id,
      mode: 'survivor',
    }
  }

  const closeSession = async (timeLeftValue) => {
    if (!sessionRef.current) return
    const payload = {
      user_id: sessionRef.current.userId,
      quiz_id: sessionRef.current.quizId,
      mode: sessionRef.current.mode,
      time_left: typeof timeLeftValue === 'number' ? timeLeftValue : timeLeft,
    }

    await fetch(`${API_BASE_URL}/game-sessions/close`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })

    sessionRef.current = null
  }

  const handleStart = () => {
    setShowIntro(false)
  }
  useEffect(() => {
    loadQuiz()
  }, [])


  useEffect(() => {
    let active = true

    const loadSubjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subjects`, {
          headers: { 'Accept': 'application/json' },
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setSubjects(data?.subjects || [])
        }
      } catch {
        if (active) {
          setSubjects([])
        }
      }
    }

    loadSubjects()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadStats = async () => {
      const storedUser = localStorage.getItem('essd_user')
      const currentUser = storedUser ? JSON.parse(storedUser) : null
      const userId = currentUser?.id

      if (!userId) {
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/scores?user_id=${userId}`, {
          headers: { 'Accept': 'application/json' },
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setUserStats({
            hits: data?.score?.survivor_hits || 0,
            errors: data?.score?.survivor_errors || 0,
            points: data?.score?.survivor_points || 0,
          })
        }
      } catch {
        if (active) {
          setUserStats({ hits: 0, errors: 0, points: 0 })
        }
      }
    }

    loadStats()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!quiz) {
      return
    }

    localStorage.setItem('essd_last_quiz_id', String(quiz.id))

    if (showIntro) {
      return
    }

    registerSession(quiz)

    timeoutHandled.current = false
    setTimeLeft(20)
    setResettingTimer(true)
    setLocked(false)
    setSelectedOption('')
    setResult('')
    setTimedOut(false)
    requestAnimationFrame(() => setResettingTimer(false))
  }, [quiz, showIntro])

  useEffect(() => {
    const handleUnload = () => {
      if (!showIntro && !locked && quiz && !timedOut && !gameOver) {
        closeSession(timeLeft)
      }
    }

    window.addEventListener('beforeunload', handleUnload)
    return () => window.removeEventListener('beforeunload', handleUnload)
  }, [showIntro, locked, quiz, timedOut, gameOver, timeLeft])

  useEffect(() => {
    if (!quiz || showIntro || locked || gameOver) {
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [quiz, showIntro, locked, gameOver])

  useEffect(() => {
    if (!quiz || showIntro || locked || timeoutHandled.current || gameOver) {
      return
    }

    if (timeLeft === 0) {
      handleTimeout()
    }
  }, [timeLeft, quiz, showIntro, locked, gameOver])

  const sendAnswer = async ({ selected, timedOut: isTimedOut, timeLeft: remainingTime }) => {
    const storedUser = localStorage.getItem('essd_user')
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    const userId = currentUser?.id

    if (!quiz?.id || !userId) {
      return
    }

    await fetch(`${API_BASE_URL}/quizzes/${quiz.id}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        user_id: Number(userId),
        selected_option: selected || null,
        timed_out: isTimedOut || false,
        game_mode: 'survivor',
        time_left: typeof remainingTime === 'number' ? remainingTime : timeLeft,
      }),
    })
  }

  const endGame = () => {
    setGameOver(true)
    setLocked(true)
  }

  const handleTimeout = () => {
    if (timeoutHandled.current || locked) {
      return
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    timeoutHandled.current = true
    setTimedOut(true)
    setResult('wrong')
    sendAnswer({ selected: '', timedOut: true, timeLeft: 0 })
    closeSession(0)
    endGame()
  }

  const handleNext = () => {
    if (gameOver) {
      return
    }
    const nextExclude = quiz?.id ? [...answeredIds, quiz.id] : [...answeredIds]
    setAnsweredIds(nextExclude)
    setResettingTimer(true)
    setTimeLeft(20)
    requestAnimationFrame(() => setResettingTimer(false))
    loadQuiz(nextExclude)
  }

  const handleSelect = (option) => {
    if (locked || !quiz || gameOver) return

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setLocked(true)
    setSelectedOption(option)
    const isCorrect = option === quiz.option_one
    setResult(isCorrect ? 'correct' : 'wrong')
    sendAnswer({ selected: option, timedOut: false, timeLeft })
    closeSession(timeLeft)

    if (isCorrect) {
      setCorrectCount((prev) => prev + 1)
    } else {
      endGame()
    }
  }

  const handleRestart = () => {
    setAnsweredIds([])
    setCorrectCount(0)
    setGameOver(false)
    setShowIntro(true)
    setQuiz(null)
    setSelectedOption('')
    setResult('')
    setTimedOut(false)
    loadQuiz([])
  }

  const options = useMemo(() => {
    if (!quiz) return []
    const shuffled = [quiz.option_one, quiz.option_two, quiz.option_three, quiz.option_four]
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [quiz?.id])
  const subjectName = useMemo(() => {
    if (!quiz?.subject_id) return ''
    return subjects.find((subject) => subject.id === quiz.subject_id)?.name || ''
  }, [quiz?.subject_id, subjects])
  const progress = timeLeft <= 0 ? 0 : Math.max(0, Math.min(100, (timeLeft / 20) * 100))
  const timerClass = timeLeft <= 5 ? 'danger' : timeLeft <= 10 ? 'warning' : 'safe'
  const timerResetClass = resettingTimer || timeLeft >= 20 || timeLeft <= 0 ? 'resetting' : ''
  const totalAttempts = userStats.hits + userStats.errors
  const accuracy = totalAttempts > 0 ? Math.round((userStats.hits / totalAttempts) * 100) : 0

  return (
    <section className="games-play">
      <header className="materials-header">
        <h2>Modo Survivor</h2>
        <p>Acerte o máximo possível sem errar.</p>
      </header>

      {!showIntro && (
        <>
          <div className="quiz-timer">
            <div
              className={`quiz-timer-fill ${timerClass} ${timerResetClass}`}
              style={{ transform: `scaleX(${progress / 100})` }}
            />
          </div>

          {loading && <div className="quiz-loading">Carregando...</div>}

          {!loading && !quiz && !gameOver && null}

          {!loading && quiz && (
            <div className="quiz-card">
              <div className="quiz-card-header">
                <div className="quiz-meta">
                  <span className="quiz-badge">#{quiz.id}</span>
                  <span className="quiz-meta-item">Matéria {subjectName || `#${quiz.subject_id}`}</span>
                  <span className="quiz-meta-item">Dificuldade: {quiz.difficulty_label || 'Fácil'}</span>
                </div>
                <div className="quiz-streak">
                  <span>Sequência de acertos até aqui: {correctCount}</span>
                  <span>Maior sequência até aqui: —</span>
                </div>
                <h3>{quiz.question}</h3>
              </div>
              <div className="quiz-options">
                {options.map((option) => {
                  const isSelected = option === selectedOption
                  const isWrong = (timedOut && result === 'wrong') || (result === 'wrong' && isSelected)
                  const isCorrect = result === 'correct' && isSelected

                  return (
                    <button
                      key={option}
                      type="button"
                      className={`quiz-option ${isWrong ? 'wrong' : ''} ${isCorrect ? 'correct' : ''}`}
                      onClick={() => handleSelect(option)}
                      disabled={locked || gameOver}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                className="primary"
                onClick={handleNext}
                disabled={!selectedOption && !timedOut}
              >
                Próxima
              </button>
            </div>
          )}
        </>
      )}

      {showIntro && (
        <div className="game-modal-backdrop" role="presentation">
          <div className="game-modal" role="dialog" aria-modal="true">
            <h3>Antes de começar</h3>
            <p>Você responderá um quizz com base nas matérias selecionadas. Errou uma, o jogo termina.</p>
            <p><strong>Taxa de acertos no Modo Survivor:</strong> {accuracy}%</p>
            <p><strong>Pontuação total (modo survivor):</strong> {userStats.points}</p>
            <div className="survivor-actions">
              <button type="button" className="ghost" onClick={() => navigate('/games/survivor')}>
                Sair
              </button>
              <button type="button" className="primary" onClick={handleStart}>
                Começar
              </button>
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="game-modal-backdrop" role="presentation">
          <div className="game-modal" role="dialog" aria-modal="true">
            <h3>Fim de jogo</h3>
            <p>Você acertou {correctCount} pergunta(s) antes de errar.</p>
            <div className="survivor-actions">
              <button type="button" className="ghost" onClick={() => navigate('/games')}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {!showIntro && !loading && !quiz && !gameOver && (
        <div className="game-modal-backdrop" role="presentation">
          <div className="game-modal" role="dialog" aria-modal="true">
            <h3>Parabéns!</h3>
            <p>Você chegou ao fim dos quizzes disponíveis nesta rodada.</p>
            <p><strong>Sua taxa de acerto no Modo Survivor:</strong> {accuracy}%</p>
            <p>Comece um novo jogo para responder novamente. Novos quizzes aparecem conforme são validados.</p>
            <div className="survivor-actions">
              <button type="button" className="primary" onClick={() => navigate('/games/survivor')}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default GamesSurvivorPlay
