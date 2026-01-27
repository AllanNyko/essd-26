import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './ManageNoticeEdit.css'

const ManageNoticeEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [observation, setObservation] = useState('')
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  useEffect(() => {
    let active = true

    const loadNotice = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
          headers: { 'Accept': 'application/json' },
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setName(data?.notice?.name || '')
          setObservation(data?.notice?.observation || '')
        }
      } catch {
        if (active) {
          setName('')
          setObservation('')
        }
      }
    }

    if (id) {
      loadNotice()
    }

    return () => {
      active = false
    }
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmed = name.trim()
    const trimmedObservation = observation.trim()
    if (!trimmed || !trimmedObservation) {
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name: trimmed, observation: trimmedObservation }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível atualizar o edital.')
      }

      setStatus({ loading: false, error: '', success: data.message || 'Edital atualizado.' })
      navigate('/manage/notices')
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <section className="manage-edit">
      <header className="materials-header">
        <h2>Editar Edital</h2>
        <p>Atualize o nome e a observação do edital selecionado.</p>
      </header>

      <FormCard
        title="Editar edital"
        description="Informe o novo nome e a observação do edital."
        actionLabel={status.loading ? 'Salvando...' : 'Salvar alterações'}
        onSubmit={handleSubmit}
        disabled={!name.trim() || !observation.trim() || status.loading}
      >
        <Input
          label="Nome do edital"
          name="name"
          placeholder="Ex.: Edital 2026 - Revisado"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Observação"
          name="observation"
          placeholder="Ex.: Edital com novas regras"
          value={observation}
          onChange={(event) => setObservation(event.target.value)}
          maxLength={50}
        />
        <div className="status">
          {status.error && <span className="error">{status.error}</span>}
          {status.success && <span className="success">{status.success}</span>}
        </div>
        <div className="manage-edit-actions">
          <button type="button" className="ghost" onClick={() => navigate('/manage/notices')}>
            Cancelar
          </button>
        </div>
      </FormCard>
    </section>
  )
}

export default ManageNoticeEdit
