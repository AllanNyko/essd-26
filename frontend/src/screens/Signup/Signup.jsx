import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import Status from '../../components/Status'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './Signup.css'

const Signup = ({ onAuthenticated }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  })
  const [planId, setPlanId] = useState('')
  const [plans, setPlans] = useState([])
  const [step, setStep] = useState(1)
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const navigate = useNavigate()

  const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0))

  useEffect(() => {
    let active = true

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

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (step === 1) {
      if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.password || !form.password_confirmation) {
        setStatus({ loading: false, error: 'Preencha todos os campos obrigatórios.', success: '' })
        return
      }

      setStatus({ loading: false, error: '', success: '' })
      setStep(2)
      return
    }

    if (!planId) {
      setStatus({ loading: false, error: 'Selecione um plano para continuar.', success: '' })
      return
    }

    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: form.phone.trim(),
          plan_id: Number(planId),
        }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível cadastrar.')
      }

      onAuthenticated?.(data.user)
      navigate('/home')
      setStatus({ loading: false, error: '', success: data.message || 'Cadastro realizado.' })
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <div className="signup-screen">
      <FormCard
        title="Criar conta"
        description={step === 1 ? 'Preencha seus dados pessoais.' : 'Escolha o plano que deseja contratar.'}
        actionLabel={step === 1 ? 'Continuar' : 'Finalizar cadastro'}
        onSubmit={handleSubmit}
        footer={<Status {...status} />}
      >
        {step === 1 && (
          <>
            <Input label="Nome completo" name="name" placeholder="Joana Silva" value={form.name} onChange={handleChange} />
            <Input label="E-mail" type="email" name="email" placeholder="voce@email.com" value={form.email} onChange={handleChange} />
            <Input label="Telefone" name="phone" placeholder="(11) 99999-9999" value={form.phone} onChange={handleChange} />
            <Input label="Senha" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            <Input
              label="Confirmar senha"
              type="password"
              name="password_confirmation"
              placeholder="••••••••"
              value={form.password_confirmation}
              onChange={handleChange}
            />
          </>
        )}

        {step === 2 && (
          <>
            <label className="signup-field">
              <span>Plano desejado</span>
              <select value={planId} onChange={(event) => setPlanId(event.target.value)}>
                <option value="">Selecione um plano</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} — {formatCurrency(plan.price)}
                  </option>
                ))}
              </select>
            </label>
            <div className="signup-actions">
              <button type="button" className="secondary" onClick={() => setStep(1)}>
                Voltar
              </button>
            </div>
          </>
        )}
      </FormCard>
    </div>
  )
}

export default Signup
