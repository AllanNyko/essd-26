import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './ManageSubjectEdit.css'

const ManageSubjectEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  useEffect(() => {
    let active = true

    const loadSubject = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
          headers: getAuthHeaders(),
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setName(data?.subject?.name || '')
        }
      } catch {
        if (active) {
          setName('')
        }
      }
    }

    if (id) {
      loadSubject()
    }

    return () => {
      active = false
    }
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmed = name.trim()
    if (!trimmed) {
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: trimmed }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível atualizar a matéria.')
      }

      setStatus({ loading: false, error: '', success: data.message || 'Matéria atualizada.' })
      navigate('/manage/subjects')
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <section className="manage-edit">
      <header className="materials-header">
        <h2>Editar Matéria</h2>
        <p>Atualize o nome da matéria selecionada.</p>
      </header>

      <FormCard
        title="Editar matéria"
        description="Informe o novo nome da matéria."
        actionLabel={status.loading ? 'Salvando...' : 'Salvar alterações'}
        onSubmit={handleSubmit}
        disabled={!name.trim() || status.loading}
      >
        <Input
          label="Nome da matéria"
          name="name"
          placeholder="Ex.: Matemática avançada"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <div className="status">
          {status.error && <span className="error">{status.error}</span>}
          {status.success && <span className="success">{status.success}</span>}
        </div>
        <div className="manage-edit-actions">
          <button type="button" className="ghost" onClick={() => navigate('/manage/subjects')}>
            Cancelar
          </button>
        </div>
      </FormCard>
    </section>
  )
}

export default ManageSubjectEdit
