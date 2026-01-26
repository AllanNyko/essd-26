import { useEffect, useState } from 'react'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './QuizValidate.css'

const QuizValidate = () => {
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, message: '' })

  const loadQuiz = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/quizzes/next`, {
        headers: { 'Accept': 'application/json' },
      })
      const data = await parseJson(response)
      setQuiz(data?.quiz || null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuiz()
  }, [])

  const handleAction = async (action) => {
    if (!quiz?.id) return

    await fetch(`${API_BASE_URL}/quizzes/${quiz.id}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ action }),
    })

    setModal({
      open: true,
      message: action === 'validate' ? 'Questão validada.' : 'Questão invalidada.',
    })

    setTimeout(() => {
      setModal({ open: false, message: '' })
      loadQuiz()
    }, 2000)
  }

  return (
    <section className="quiz-validate">
      <header className="materials-header">
        <h2>Validar Quizz</h2>
        <p>Revise a pergunta e as alternativas antes de aprovar.</p>
      </header>

      {loading && <div className="quiz-validate-loading">Carregando...</div>}

      {!loading && !quiz && (
        <div className="quiz-validate-empty">
          <div className="card">
            <div className="card-header">
              <h3>Sem pendências</h3>
              <p>Nenhum quizz aguardando validação.</p>
            </div>
          </div>
        </div>
      )}

      {!loading && quiz && (
        <div className="quiz-validate-card">
          <div className="quiz-validate-header">
            <span className="quiz-id">#{quiz.id}</span>
            <h3>{quiz.question}</h3>
          </div>

          <ul className="quiz-validate-options">
            <li>{quiz.option_one}</li>
            <li>{quiz.option_two}</li>
            <li>{quiz.option_three}</li>
            <li>{quiz.option_four}</li>
          </ul>

          <div className="quiz-validate-actions">
            <button type="button" className="action-button reject" aria-label="Reprovar" onClick={() => handleAction('invalidate')}>
              👎
            </button>
            <button type="button" className="action-button approve" aria-label="Aprovar" onClick={() => handleAction('validate')}>
              👍
            </button>
          </div>
        </div>
      )}

      {modal.open && (
        <div className="quiz-modal">
          <div className="quiz-modal-content">{modal.message}</div>
        </div>
      )}
    </section>
  )
}

export default QuizValidate
