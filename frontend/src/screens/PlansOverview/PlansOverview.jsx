import { useEffect, useState } from 'react'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './PlansOverview.css'

const PlansOverview = () => {
  const [plans, setPlans] = useState([])
  const [currentPlanId, setCurrentPlanId] = useState(null)

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))

  useEffect(() => {
    let active = true

    const storedUser = localStorage.getItem('essd_user')
    const currentUser = storedUser ? JSON.parse(storedUser) : null
    setCurrentPlanId(currentUser?.plan_id ?? null)

    const loadPlans = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/plans`, {
          headers: { 'Accept': 'application/json' },
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setPlans(data?.plans || [])
        }
      } catch {
        if (active) {
          setPlans([])
        }
      }
    }

    loadPlans()

    return () => {
      active = false
    }
  }, [])

  return (
    <section className="plans-overview">
      <header className="materials-header">
        <h2>Planos disponíveis</h2>
        <p>Confira os planos e escolha o que melhor atende você.</p>
      </header>

      <div className="plans-list card">
        <div className="card-header">
          <h2>Planos</h2>
          <p>Informações resumidas sobre cada plano.</p>
        </div>
        <ul>
          {plans.length === 0 && <li className="muted">Nenhum plano disponível no momento.</li>}
          {plans.map((plan) => {
            const isCurrent = Number(plan.id) === Number(currentPlanId)
            const currentPlanPrice = plans.find((item) => Number(item.id) === Number(currentPlanId))?.price
            const canChange = !isCurrent
              && (currentPlanPrice === undefined || Number(plan.price || 0) >= Number(currentPlanPrice || 0))

            return (
            <li
              key={plan.id}
              className={`plans-item ${isCurrent ? 'active' : ''}`}
            >
              <div className="plans-item-info">
                <strong>{plan.name}</strong>
                <span>{formatCurrency(plan.price)}</span>
                <small>{plan.coverage}</small>
                <small>Destino: {plan.audience}</small>
              </div>
              {canChange && (
                <button type="button" className="primary">Mudar este plano</button>
              )}
            </li>
          )})}
        </ul>
      </div>
    </section>
  )
}

export default PlansOverview
