import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './ManageSubjects.css'

const ManageSubjects = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [subjects, setSubjects] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [modal, setModal] = useState({ open: false, item: null })

  const loadSubjects = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        headers: getAuthHeaders(),
      })
      const data = await parseJson(response)

      if (response.ok) {
        setSubjects(data?.subjects || [])
      }
    } catch {
      setSubjects([])
    }
  }

  useEffect(() => {
    loadSubjects()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmed = name.trim()
    if (!trimmed) {
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/subjects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: trimmed }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível cadastrar a matéria.')
      }

      setStatus({ loading: false, error: '', success: data.message || 'Matéria cadastrada com sucesso.' })
      setName('')
      loadSubjects()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  const handleDelete = async () => {
    if (!modal.item?.id) return

    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${modal.item.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível excluir a matéria.')
      }

      setModal({ open: false, item: null })
      loadSubjects()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
      setModal({ open: false, item: null })
    }
  }

  return (
    <section className="manage-page">
      <header className="materials-header">
        <h2>Gerenciar Matérias</h2>
        <p>Cadastre novas matérias para o banco de dados.</p>
      </header>

      <FormCard
        title="Nova matéria"
        description="Informe o nome da matéria a ser adicionada."
        actionLabel={status.loading ? 'Salvando...' : 'Cadastrar'}
        onSubmit={handleSubmit}
        disabled={!name.trim() || status.loading}
      >
        <Input
          label="Nome da matéria"
          name="name"
          placeholder="Ex.: Matemática"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div className="status">
          {status.error && <span className="error">{status.error}</span>}
          {status.success && <span className="success">{status.success}</span>}
        </div>
      </FormCard>

      <div className="manage-list card">
        <div className="card-header">
          <h2>Matérias cadastradas</h2>
          <p>Confira as matérias já disponíveis.</p>
        </div>
        <ul>
          {subjects.length === 0 && <li className="muted">Nenhuma matéria cadastrada.</li>}
          {subjects.map((subject) => (
            <li key={subject.id} className="manage-item">
              <span>{subject.name}</span>
              <div className="manage-item-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => navigate(`/manage/subjects/${subject.id}/edit`)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => setModal({ open: true, item: subject })}
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {modal.open && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true">
            <h3>Excluir matéria?</h3>
            <p>Esta ação é irreversível. Deseja continuar?</p>
            <div className="modal-actions">
              <button type="button" className="ghost" onClick={() => setModal({ open: false, item: null })}>
                Cancelar
              </button>
              <button type="button" className="danger" onClick={handleDelete}>
                Entendo o risco, continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ManageSubjects
