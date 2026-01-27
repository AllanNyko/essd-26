import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './GamesIndividual.css'

const GamesIndividual = () => {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [mode, setMode] = useState('')

  useEffect(() => {
    let active = true

    const loadSubjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subjects?only_with_quizzes=1`, {
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

  const toggleSubject = (subjectId) => {
    setSelectedSubjects((prev) => (
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    ))
  }

  const handleSingle = () => {
    setMode('single')
  }

  const handleMulti = () => {
    setMode('multi')
  }

  const handleStartMulti = () => {
    if (selectedSubjects.length === 0) return
    localStorage.removeItem('essd_last_quiz_id')
    localStorage.setItem('essd_game_mode', 'multi')
    localStorage.setItem('essd_game_subjects', JSON.stringify(selectedSubjects))
    navigate('/games/individual/play')
  }

  const handleStartSingle = () => {
    if (!selectedSubjectId) return
    localStorage.removeItem('essd_last_quiz_id')
    localStorage.setItem('essd_game_mode', 'single')
    localStorage.setItem('essd_game_subjects', JSON.stringify([Number(selectedSubjectId)]))
    navigate('/games/individual/play')
  }

  return (
    <section className="games-individual">
      <header className="materials-header">
        <h2>Modo Individual</h2>
        <p>Escolha como deseja montar seu quizz.</p>
      </header>

      <div className="games-mode-grid">
        <div
          className="games-mode-card single"
          role="button"
          tabIndex={0}
          onClick={handleSingle}
          onKeyDown={(event) => event.key === 'Enter' && handleSingle()}
        >
          <div className="games-mode-content">
            <h3>Matéria específica</h3>
            <span>Jogue um quizz direto por matéria.</span>
          </div>
        </div>

        <div
          className="games-mode-card multi"
          role="button"
          tabIndex={0}
          onClick={handleMulti}
          onKeyDown={(event) => event.key === 'Enter' && handleMulti()}
        >
          <div className="games-mode-content">
            <h3>Múltiplas matérias</h3>
            <span>Monte um quizz com várias matérias.</span>
          </div>
        </div>
      </div>

      {mode === 'multi' && (
        <div className="card">
          <div className="card-header">
            <h2>Selecionar matérias</h2>
            <p>Escolha quais matérias devem compor o quizz.</p>
          </div>
          <div className="games-multi-list">
            {subjects.map((subject) => (
              <label key={subject.id} className="games-checkbox">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject.id)}
                  onChange={() => toggleSubject(subject.id)}
                />
                <span>{subject.name}</span>
              </label>
            ))}
            {subjects.length === 0 && (
              <span className="muted">Nenhuma matéria disponível.</span>
            )}
          </div>
          <button
            type="button"
            className="primary"
            disabled={selectedSubjects.length === 0}
            onClick={handleStartMulti}
          >
            Iniciar jogo
          </button>
        </div>
      )}

      {mode === 'single' && (
        <div className="card">
          <div className="card-header">
            <h2>Selecionar matéria</h2>
            <p>Escolha a matéria específica para jogar.</p>
          </div>
          <div className="games-multi-list">
            {subjects.map((subject) => (
              <label key={subject.id} className="games-checkbox">
                <input
                  type="radio"
                  name="single-subject"
                  checked={String(selectedSubjectId) === String(subject.id)}
                  onChange={() => setSelectedSubjectId(subject.id)}
                />
                <span>{subject.name}</span>
              </label>
            ))}
            {subjects.length === 0 && (
              <span className="muted">Nenhuma matéria disponível.</span>
            )}
          </div>
          <button
            type="button"
            className="primary"
            disabled={!selectedSubjectId}
            onClick={handleStartSingle}
          >
            Iniciar jogo
          </button>
        </div>
      )}
    </section>
  )
}

export default GamesIndividual
