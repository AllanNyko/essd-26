import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './ManagePlans.css'

const ManagePlans = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [coverage, setCoverage] = useState('')
  const [audience, setAudience] = useState('')
  const [plans, setPlans] = useState([])
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [modal, setModal] = useState({ open: false, item: null })

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))

  const loadPlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/plans`, {
        headers: getAuthHeaders(),
      })
      const data = await parseJson(response)

      if (response.ok) {
        setPlans(data?.plans || [])
      }
    } catch {
      setPlans([])
    }
  }

  useEffect(() => {
    loadPlans()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    const trimmed = name.trim()
    if (!trimmed || !price || !coverage.trim() || !audience.trim()) {
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/plans`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: trimmed,
          price: Number(price),
          coverage: coverage.trim(),
          audience: audience.trim(),
        }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível cadastrar o plano.')
      }

      setStatus({ loading: false, error: '', success: data.message || 'Plano cadastrado com sucesso.' })
      setName('')
      setPrice('')
      setCoverage('')
      setAudience('')
      loadPlans()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  const handleDelete = async () => {
    if (!modal.item?.id) return

    try {
      const response = await fetch(`${API_BASE_URL}/plans/${modal.item.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível excluir o plano.')
      }

      setModal({ open: false, item: null })
      loadPlans()
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
      setModal({ open: false, item: null })
    }
  }

  return (
    <section className="manage-page">
      <header className="materials-header">
        <h2>Gerenciar Planos</h2>
        <p>Cadastre novos planos para o banco de dados.</p>
      </header>

      <FormCard
        title="Novo plano"
        description="Informe o nome do plano a ser adicionado."
        actionLabel={status.loading ? 'Salvando...' : 'Cadastrar'}
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
          placeholder="Ex.: 99.90"
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
      </FormCard>

      <div className="manage-list card">
        <div className="card-header">
          <h2>Planos cadastrados</h2>
          <p>Confira os planos já disponíveis.</p>
        </div>
        <ul>
          {plans.length === 0 && <li className="muted">Nenhum plano cadastrado.</li>}
          {plans.map((plan) => (
            <li key={plan.id} className="manage-item">
              <div className="manage-item-info">
                <strong>{plan.name}</strong>
                <span>{formatCurrency(plan.price)}</span>
                <small>{plan.coverage}</small>
                <small>Destino: {plan.audience}</small>
              </div>
              <div className="manage-item-actions">
                <button
                  type="button"
                  className="secondary"
                  onClick={() => navigate(`/manage/plans/${plan.id}/edit`)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => setModal({ open: true, item: plan })}
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
            <h3>Excluir plano?</h3>
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

export default ManagePlans
