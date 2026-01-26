import { useState } from 'react'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import Status from '../../components/Status'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível enviar o link.')
      }

      setStatus({ loading: false, error: '', success: data.message || 'Link enviado.' })
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  return (
    <div className="forgot-password-screen">
      <FormCard
        title="Recuperar senha"
        description="Enviaremos um link para redefinir sua senha."
        actionLabel="Enviar link"
        onSubmit={handleSubmit}
        footer={<Status {...status} />}
      >
        <Input
          label="E-mail"
          type="email"
          name="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormCard>
    </div>
  )
}

export default ForgotPassword
