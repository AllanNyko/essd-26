import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import Status from '../../components/Status'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './Login.css'

const Login = ({ onAuthenticated }) => {
  const [form, setForm] = useState({ email: '', password: '' })
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível autenticar.')
      }

      onAuthenticated?.(data.user, data.token)
      navigate('/home')
      setStatus({ loading: false, error: '', success: data.message || 'Login efetuado.' })
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <div className="login-screen">
      <FormCard
        title="Login"
        description="Entre para acessar o painel."
        actionLabel="Entrar"
        onSubmit={handleSubmit}
        footer={(
          <>
            <Status {...status} />
            <div className="auth-links">
              <NavLink to="/signup">Criar conta</NavLink>
              <span>•</span>
              <NavLink to="/forgot-password">Recuperar senha</NavLink>
            </div>
          </>
        )}
      >
        <Input label="E-mail" type="email" name="email" placeholder="voce@email.com" value={form.email} onChange={handleChange} />
        <Input label="Senha" type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
        <label className="checkbox">
          <input type="checkbox" name="remember" />
          <span>Manter conectado</span>
        </label>
      </FormCard>
    </div>
  )
}

export default Login
