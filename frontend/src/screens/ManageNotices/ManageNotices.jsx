import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './ManageNotices.css'

const ManageNotices = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [observation, setObservation] = useState('')
  const [notices, setNotices] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [modal, setModal] = useState({ open: false, item: null })

  const loadNotices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/notices`, {
        headers: { 'Accept': 'application/json' },
      })
      const data = await parseJson(response)

      if (response.ok) {
        setNotices(data?.notices || [])
      }
    } catch {
      setNotices([])
    }
  }

  useEffect(() => {
    loadNotices()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmed = name.trim()
    const trimmedObservation = observation.trim()
    if (!trimmed || !trimmedObservation) {
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: trimmed, observation: trimmedObservation }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível cadastrar o edital.')
      }

      setStatus({ loading: false, error: '', success: data.message || 'Edital cadastrado com sucesso.' })
      setName('')
      setObservation('')
      loadNotices()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  const handleDelete = async () => {
    if (!modal.item?.id) return

    try {
      const response = await fetch(`${API_BASE_URL}/notices/${modal.item.id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' },
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível excluir o edital.')
      }

      setModal({ open: false, item: null })
      loadNotices()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
      setModal({ open: false, item: null })
    }
  }

  return (
    <section className="manage-page">
      <header className="materials-header">
        <h2>Gerenciar Editais</h2>
        <p>Cadastre novos editais para o banco de dados.</p>
      </header>

      <FormCard
        title="Novo edital"
        description="Informe o nome do edital a ser adicionado."
        actionLabel={status.loading ? 'Salvando...' : 'Cadastrar'}
        onSubmit={handleSubmit}
        disabled={!name.trim() || !observation.trim() || status.loading}
      >
        <Input
          label="Nome do edital"
          name="name"
          placeholder="Ex.: Edital 2026"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Observação"
          name="observation"
          placeholder="Ex.: Vagas na área administrativa"
          value={observation}
          onChange={(event) => setObservation(event.target.value)}
          maxLength={50}
        />
        <div className="status">
          {status.error && <span className="error">{status.error}</span>}
          {status.success && <span className="success">{status.success}</span>}
        </div>
      </FormCard>

      <div className="manage-list card">
        <div className="card-header">
          <h2>Editais cadastrados</h2>
          <p>Confira os editais já disponíveis.</p>
        </div>
        <ul>
          {notices.length === 0 && <li className="muted">Nenhum edital cadastrado.</li>}
          {notices.map((notice) => (
            <li key={notice.id} className="manage-item">
              <span>{notice.name}</span>
              <div className="manage-item-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => navigate(`/manage/notices/${notice.id}/edit`)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => setModal({ open: true, item: notice })}
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
            <h3>Excluir edital?</h3>
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

export default ManageNotices
