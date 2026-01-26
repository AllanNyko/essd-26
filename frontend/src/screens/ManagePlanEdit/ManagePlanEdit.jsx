import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './ManagePlanEdit.css'

const ManagePlanEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [coverage, setCoverage] = useState('')
  const [audience, setAudience] = useState('')
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  useEffect(() => {
    let active = true

    const loadPlan = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
          headers: { 'Accept': 'application/json' },
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setName(data?.plan?.name || '')
          setPrice(String(data?.plan?.price ?? ''))
          setCoverage(data?.plan?.coverage || '')
          setAudience(data?.plan?.audience || '')
        }
      } catch {
        if (active) {
          setName('')
          setPrice('')
          setCoverage('')
          setAudience('')
        }
      }
    }

    if (id) {
      loadPlan()
    }

    return () => {
      active = false
    }
  }, [id])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmed = name.trim()
    if (!trimmed || !price || !coverage.trim() || !audience.trim()) {
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/plans/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: trimmed,
          price: Number(price),
          coverage: coverage.trim(),
          audience: audience.trim(),
        }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível atualizar o plano.')
      }

      setStatus({ loading: false, error: '', success: data.message || 'Plano atualizado.' })
      navigate('/manage/plans')
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <section className="manage-edit">
      <header className="materials-header">
        <h2>Editar Plano</h2>
        <p>Atualize as informações do plano selecionado.</p>
      </header>

      <FormCard
        title="Editar plano"
        description="Atualize nome, valor e descrição do plano."
        actionLabel={status.loading ? 'Salvando...' : 'Salvar alterações'}
        onSubmit={handleSubmit}
        disabled={!name.trim() || !price || !coverage.trim() || !audience.trim() || status.loading}
      >
        <Input
          label="Nome do plano"
          name="name"
          placeholder="Ex.: Plano avançado"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Input
          label="Valor do plano (R$)"
          name="price"
          type="number"
          placeholder="Ex.: 119.90"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
        <label className="plan-field">
          <span>O que o plano contempla</span>
          <textarea
            rows={4}
            value={coverage}
            onChange={(event) => setCoverage(event.target.value)}
            placeholder="Descreva os benefícios do plano"
          />
        </label>
        <label className="plan-field">
          <span>Para quem se destina</span>
          <textarea
            rows={3}
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
            placeholder="Ex.: Alunos do curso de formação"
          />
        </label>
        <div className="status">
          {status.error && <span className="error">{status.error}</span>}
          {status.success && <span className="success">{status.success}</span>}
        </div>
        <div className="manage-edit-actions">
          <button type="button" className="ghost" onClick={() => navigate('/manage/plans')}>
            Cancelar
          </button>
        </div>
      </FormCard>
    </section>
  )
}

export default ManagePlanEdit
