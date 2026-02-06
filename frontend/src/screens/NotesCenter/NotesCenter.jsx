import { useEffect, useState } from 'react'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './NotesCenter.css'

const NotesCenter = () => {
  const [subjects, setSubjects] = useState([])
  const [subjectId, setSubjectId] = useState('')
  const [score, setScore] = useState('')
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const usedSubjectIds = new Set(notes.map((note) => Number(note.subject_id)))

  const filteredSubjects = subjects.filter((subject) => (
    !usedSubjectIds.has(Number(subject.id))
    && subject.name.toLowerCase().includes(search.trim().toLowerCase())
  ))

  useEffect(() => {
    let active = true

    const loadSubjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subjects`, {
          headers: getAuthHeaders(),
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

    const loadNotes = async () => {
      const storedUser = localStorage.getItem('essd_user')
      const currentUser = storedUser ? JSON.parse(storedUser) : null
      const userId = currentUser?.id

      if (!userId) {
        setNotes([])
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/notes?user_id=${userId}`, {
          headers: getAuthHeaders(),
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setNotes(data?.notes || [])
        }
      } catch {
        if (active) {
          setNotes([])
        }
      }
    }

    loadSubjects()
    loadNotes()

    return () => {
      active = false
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const storedUser = localStorage.getItem('essd_user')
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    const userId = currentUser?.id

    if (!userId) {
      setStatus({ loading: false, error: 'Usuário não autenticado.', success: '' })
      return
    }

    if (!subjectId || score === '') {
      setStatus({ loading: false, error: 'Selecione a matéria e informe a nota.', success: '' })
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          user_id: Number(userId),
          notice_id: currentUser?.notice_id ?? null,
          subject_id: Number(subjectId),
          score: Number(score),
        }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível registrar a nota.')
      }

      setStatus({ loading: false, error: '', success: data.message || 'Nota registrada com sucesso.' })
      setSubjectId('')
      setScore('')
      setSearch('')

      const storedNotesResponse = await fetch(`${API_BASE_URL}/notes?user_id=${userId}`, {
        headers: getAuthHeaders(),
      })
      const storedNotesData = await parseJson(storedNotesResponse)
      if (storedNotesResponse.ok) {
        setNotes(storedNotesData?.notes || [])
      }
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <section className="notes-center">
      <header className="materials-header">
        <h2>Central de Notas</h2>
        <p>Escolha a matéria e registre a nota da prova.</p>
      </header>

      <form className="notes-card card" onSubmit={handleSubmit}>
        <div className="card-header">
          <h2>Registrar nota</h2>
          <p>Selecione a matéria e informe a nota obtida.</p>
        </div>

        <label className="notes-field">
          <span>Pesquisar matéria</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Digite o nome da matéria"
          />
        </label>

        {search.trim() && (
          <ul className="notes-search-results">
            {filteredSubjects.length === 0 && (
              <li className="muted">Nenhuma matéria encontrada.</li>
            )}
            {filteredSubjects.map((subject) => (
              <li key={subject.id}>
                <button
                  type="button"
                  className="notes-result"
                  onClick={() => {
                    setSubjectId(String(subject.id))
                    setSearch(subject.name)
                  }}
                >
                  {subject.name}
                </button>
              </li>
            ))}
          </ul>
        )}

        <label className="notes-field">
          <span>Matéria</span>
          <select value={subjectId} onChange={(event) => setSubjectId(event.target.value)}>
            <option value="">Selecione a matéria</option>
            {subjects.filter((subject) => !usedSubjectIds.has(Number(subject.id))).map((subject) => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </label>

        <label className="notes-field">
          <span>Nota (0 a 10)</span>
          <input
            type="number"
            min={0}
            max={10}
            step={0.1}
            value={score}
            onChange={(event) => setScore(event.target.value)}
            placeholder="Ex.: 8.5"
          />
        </label>
        <div className="status">
          {status.error && <span className="error">{status.error}</span>}
          {status.success && <span className="success">{status.success}</span>}
        </div>
        <button type="submit" className="primary" disabled={status.loading}>
          {status.loading ? 'Salvando...' : 'Registrar nota'}
        </button>
      </form>
    </section>
  )
}

export default NotesCenter
