import { useEffect, useMemo, useRef, useState } from 'react'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './GamesIndividualPlay.css'

const GamesIndividualPlay = () => {
  const [showIntro, setShowIntro] = useState(true)
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(20)
  const [locked, setLocked] = useState(false)
  const [selectedOption, setSelectedOption] = useState('')
  const [result, setResult] = useState('')
  const [timedOut, setTimedOut] = useState(false)
  const [answeredIds, setAnsweredIds] = useState([])
  const timeoutHandled = useRef(false)
  const [resettingTimer, setResettingTimer] = useState(false)
  const timerRef = useRef(null)

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

  useEffect(() => {
    loadQuiz()
  }, [])

  useEffect(() => {
    if (!quiz) {
      return
    }

    localStorage.setItem('essd_last_quiz_id', String(quiz.id))

    timeoutHandled.current = false
    setTimeLeft(20)
    setResettingTimer(true)
    setLocked(false)
    setSelectedOption('')
    setResult('')
    setTimedOut(false)
    requestAnimationFrame(() => setResettingTimer(false))
  }, [quiz])

  useEffect(() => {
    if (!quiz || showIntro || locked) {
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
  }, [quiz, showIntro, locked])

  useEffect(() => {
    if (!quiz || showIntro || locked || timeoutHandled.current) {
      return
    }

    if (timeLeft === 0) {
      handleTimeout()
    }
  }, [timeLeft, quiz, showIntro, locked])

  const sendAnswer = async ({ selected, timedOut: isTimedOut }) => {
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
      }),
    })
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
    setLocked(true)
    setTimedOut(true)
    setResult('wrong')
    sendAnswer({ selected: '', timedOut: true })
  }

  const handleNext = () => {
    const nextExclude = quiz?.id ? [...answeredIds, quiz.id] : [...answeredIds]
    setAnsweredIds(nextExclude)
    setResettingTimer(true)
    setTimeLeft(20)
    requestAnimationFrame(() => setResettingTimer(false))
    loadQuiz(nextExclude)
  }

  const handleSelect = (option) => {
    if (locked || !quiz) return

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    setLocked(true)
    setSelectedOption(option)
    const isCorrect = option === quiz.option_one
    setResult(isCorrect ? 'correct' : 'wrong')
    sendAnswer({ selected: option, timedOut: false })
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
  const progress = timeLeft <= 0 ? 0 : Math.max(0, Math.min(100, (timeLeft / 20) * 100))
  const timerClass = timeLeft <= 5 ? 'danger' : timeLeft <= 10 ? 'warning' : 'safe'
  const timerResetClass = resettingTimer || timeLeft >= 20 || timeLeft <= 0 ? 'resetting' : ''

  return (
    <section className="games-play">
      <header className="materials-header">
        <h2>Modo Individual</h2>
        <p>Responda às perguntas no seu ritmo.</p>
      </header>

      <div className="quiz-timer">
        <div
          className={`quiz-timer-fill ${timerClass} ${timerResetClass}`}
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>

      {loading && <div className="quiz-loading">Carregando...</div>}

      {!loading && !quiz && (
        <div className="card">
          <div className="card-header">
            <h2>Sem perguntas</h2>
            <p>Não há quizzes disponíveis para o modo individual.</p>
          </div>
        </div>
      )}

      {!loading && quiz && (
        <div className="quiz-card">
          <div className="quiz-card-header">
            <div className="quiz-meta">
              <span className="quiz-badge">#{quiz.id}</span>
              <span className="quiz-meta-item">Matéria #{quiz.subject_id}</span>
              <span className="quiz-meta-item">Dificuldade: fácil</span>
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
                  disabled={locked}
                >
                  {option}
                </button>
              )
            })}
          </div>
          <button type="button" className="primary" onClick={handleNext} disabled={!selectedOption && !timedOut}>
            Próxima
          </button>
        </div>
      )}

      {showIntro && (
        <div className="game-modal-backdrop" role="presentation">
          <div className="game-modal" role="dialog" aria-modal="true">
            <h3>Antes de começar</h3>
            <p>Você responderá um quizz com base nas matérias selecionadas. Leia com atenção e escolha a melhor opção.</p>
            <button type="button" className="primary" onClick={() => setShowIntro(false)}>
              Começar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default GamesIndividualPlay
