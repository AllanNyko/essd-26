import { useState } from 'react'
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
    password: '',
    password_confirmation: '',
  })
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
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
        description="Acesse sua conta ESSD em segundos."
        actionLabel="Cadastrar"
        onSubmit={handleSubmit}
        footer={<Status {...status} />}
      >
        <Input label="Nome completo" name="name" placeholder="Joana Silva" value={form.name} onChange={handleChange} />
        <Input label="E-mail" type="email" name="email" placeholder="voce@email.com" value={form.email} onChange={handleChange} />
        <Input label="Senha" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
        <Input
          label="Confirmar senha"
          type="password"
          name="password_confirmation"
          placeholder="••••••••"
          value={form.password_confirmation}
          onChange={handleChange}
        />
      </FormCard>
    </div>
  )
}

export default Signup
