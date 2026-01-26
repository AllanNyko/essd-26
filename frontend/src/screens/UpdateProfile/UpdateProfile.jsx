import { useEffect, useMemo, useState } from 'react'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import { API_BASE_URL, parseJson } from '../../lib/api'
import './UpdateProfile.css'

const UpdateProfile = ({ user, onUserUpdated }) => {
  const initial = useMemo(() => ({
    id: user?.id ? String(user.id) : '',
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  }), [user])

  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [modal, setModal] = useState({ open: false, type: '', message: '' })

  useEffect(() => {
    setForm(initial)
  }, [initial])

  const isDirty = form.id !== initial.id
    || form.name !== initial.name
    || form.email !== initial.email
    || form.password.length > 0
    || form.password_confirmation.length > 0

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    if (!form.id) {
      setStatus({ loading: false, error: 'Informe o ID do usuário.', success: '' })
      return
    }

    if (form.password && form.password !== form.password_confirmation) {
      setStatus({ loading: false, error: 'As senhas não conferem.', success: '' })
      return
    }

    const payload = {}
    if (form.name) payload.name = form.name
    if (form.email) payload.email = form.email
    if (form.password) {
      payload.password = form.password
      payload.password_confirmation = form.password_confirmation
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${form.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Não foi possível atualizar os dados.')
      }

      if (data?.user) {
        onUserUpdated?.(data.user)
        setForm((prev) => ({
          ...prev,
          name: data.user.name || prev.name,
          email: data.user.email || prev.email,
          password: '',
          password_confirmation: '',
        }))
      }

      const successMessage = data.message || 'Dados atualizados.'
      setStatus({ loading: false, error: '', success: successMessage })
      setModal({ open: true, type: 'success', message: successMessage })
    } catch (error) {
      const errorMessage = error.message || 'Não foi possível atualizar os dados.'
      setStatus({ loading: false, error: errorMessage, success: '' })
      setModal({ open: true, type: 'error', message: errorMessage })
    }
  }

  return (
    <>
      <FormCard
        title="Alterar dados"
        description="Atualize suas informações de perfil."
        actionLabel="Salvar"
        onSubmit={handleSubmit}
        disabled={!isDirty || status.loading}
      >
        <Input
          label="ID do usuário"
          name="id"
          placeholder="1"
          value={form.id}
          onChange={handleChange}
        />
        <Input label="Nome completo" name="name" placeholder="Joana Silva" value={form.name} onChange={handleChange} required={false} />
        <Input label="E-mail" type="email" name="email" placeholder="voce@email.com" value={form.email} onChange={handleChange} required={false} />
        <Input
          label="Nova senha (opcional)"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required={false}
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          name="password_confirmation"
          placeholder="••••••••"
          value={form.password_confirmation}
          onChange={handleChange}
          required={false}
        />
      </FormCard>
      {modal.open && (
        <div className="modal-backdrop" role="presentation">
          <div className={`modal ${modal.type}`} role="dialog" aria-modal="true">
            <h3>{modal.type === 'success' ? 'Atualização concluída' : 'Falha na atualização'}</h3>
            <p>{modal.message}</p>
            <button type="button" className="primary" onClick={() => setModal({ open: false, type: '', message: '' })}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateProfile
