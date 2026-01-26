import { useEffect, useState } from 'react'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './QuizSend.css'

const QuizSend = () => {
  const [question, setQuestion] = useState('')
  const [answers, setAnswers] = useState(['', '', '', ''])
  const [subjectId, setSubjectId] = useState('')
  const [subjects, setSubjects] = useState([])

  const questionValid = question.trim().length >= 20
  const answersValid = answers.every((answer) => answer.trim().length >= 2)
  const isFormValid = questionValid && answersValid && subjectId

  useEffect(() => {
    let active = true

    const loadSubjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subjects`, {
          headers: { 'Accept': 'application/json' },
        })
        const data = await parseJson(response)

        if (!response.ok) {
          return
        }

        if (active) {
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

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => prev.map((item, idx) => (idx === index ? value : item)))
  }

  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    const storedUser = localStorage.getItem('essd_user')
    const currentUser = storedUser ? JSON.parse(storedUser) : null

    if (!currentUser?.id) {
      setStatus({ loading: false, error: 'Usuário não autenticado.', success: '' })
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          user_id: Number(currentUser.id),
          subject_id: Number(subjectId),
          question: question.trim(),
          option_one: answers[0].trim(),
          option_two: answers[1].trim(),
          option_three: answers[2].trim(),
          option_four: answers[3].trim(),
        }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível enviar o quizz.')
      }

      setStatus({ loading: false, error: '', success: data.message || 'Quizz enviado com sucesso.' })
      setQuestion('')
      setAnswers(['', '', '', ''])
      setSubjectId('')
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <section className="quiz-send">
      <header className="materials-header">
        <h2>Enviar Quizz</h2>
        <p>Preencha a pergunta e as alternativas.</p>
      </header>

      <form className="quiz-form" onSubmit={handleSubmit}>
        <label className="quiz-field">
          <span>Matéria</span>
          <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>
            <option value="">Selecione a matéria</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </label>

        <label className="quiz-field">
          <span>Pergunta</span>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Digite a pergunta"
            rows={4}
            minLength={20}
          />
        </label>

        <div className="quiz-answers">
          {answers.map((answer, index) => (
            <label key={index} className={`quiz-field ${index === 0 ? 'correct' : 'wrong'}`}>
              <span>{index === 0 ? 'Alternativa correta' : `Alternativa ${index + 1}`}</span>
              <input
                type="text"
                value={answer}
                onChange={(event) => handleAnswerChange(index, event.target.value)}
                placeholder="Digite a alternativa"
                minLength={2}
              />
            </label>
          ))}
        </div>

        {status.error && <span className="status-error">{status.error}</span>}
        {status.success && <span className="status-success">{status.success}</span>}

        <button type="submit" className="primary" disabled={!isFormValid || status.loading}>
          {status.loading ? 'Enviando...' : 'Enviar quizz'}
        </button>
      </form>
    </section>
  )
}

export default QuizSend
