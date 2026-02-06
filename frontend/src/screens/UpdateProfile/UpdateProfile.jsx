import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './UpdateProfile.css'

const UpdateProfile = ({ user, onUserUpdated }) => {
  const navigate = useNavigate()
  const initial = useMemo(() => ({
    id: user?.id ? String(user.id) : '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notice_id: user?.notice_id ? String(user.notice_id) : '',
    password: '',
    password_confirmation: '',
  }), [user])

  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  const [modal, setModal] = useState({ open: false, type: '', message: '' })
  const [plans, setPlans] = useState([])
  const [notices, setNotices] = useState([])
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || user?.avatar || '')
  const fileInputRef = useRef(null)

  useEffect(() => {
    setForm(initial)
    setAvatarPreview(user?.avatar_url || user?.avatar || '')
  }, [initial])

  useEffect(() => {
    let active = true

    const loadPlans = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/plans`, {
          headers: getAuthHeaders(),
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

    const loadNotices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/notices`, {
          headers: getAuthHeaders(),
        })
        const data = await parseJson(response)

        if (response.ok && active) {
          setNotices(data?.notices || [])
        }
      } catch {
        if (active) {
          setNotices([])
        }
      }
    }

    loadPlans()
    loadNotices()

    return () => {
      active = false
    }
  }, [])

  const isDirty = form.id !== initial.id
    || form.name !== initial.name
    || form.email !== initial.email
    || form.phone !== initial.phone
    || form.notice_id !== initial.notice_id
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
      const message = 'Informe o ID do usuário.'
      setStatus({ loading: false, error: message, success: '' })
      setModal({ open: true, type: 'error', message })
      return
    }

    if (form.password && form.password !== form.password_confirmation) {
      const message = 'As senhas não conferem.'
      setStatus({ loading: false, error: message, success: '' })
      setModal({ open: true, type: 'error', message })
      return
    }

    const payload = {}
    if (form.name) payload.name = form.name
    if (form.email) payload.email = form.email
    if (form.phone || form.phone === '') payload.phone = form.phone
    if (form.notice_id !== initial.notice_id) {
      payload.notice_id = form.notice_id ? Number(form.notice_id) : null
    }
    if (form.password) {
      payload.password = form.password
      payload.password_confirmation = form.password_confirmation
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${form.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
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
          phone: data.user.phone || '',
          notice_id: data.user.notice_id ? String(data.user.notice_id) : '',
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

  const handleAvatarSelect = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const reader = new FileReader()

    reader.onload = async () => {
      const preview = reader.result
      if (typeof preview !== 'string') {
        return
      }

      setAvatarPreview(preview)

      if (!user?.id) {
        onUserUpdated?.({ ...user, avatar_url: preview })
        setModal({ open: true, type: 'success', message: 'Foto atualizada com sucesso.' })
        return
      }

      try {
        const response = await fetch(`${API_BASE_URL}/users/${user.id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ avatar_url: preview }),
        })

        const data = await parseJson(response)

        if (!response.ok) {
          throw new Error(data?.message || 'Não foi possível atualizar a foto.')
        }

        if (data?.user) {
          onUserUpdated?.(data.user)
        }

        setModal({ open: true, type: 'success', message: 'Foto atualizada com sucesso.' })
      } catch (error) {
        setModal({ open: true, type: 'error', message: error.message || 'Não foi possível atualizar a foto.' })
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <>
      <FormCard
        title="Alterar dados"
        description="Atualize suas informações de perfil."
        actionLabel="Salvar"
        onSubmit={handleSubmit}
        disabled={!isDirty || status.loading}
        headerRight={(
          <div className="profile-avatar">
            <img src={avatarPreview || 'https://i.pravatar.cc/80?img=15'} alt="Foto do usuário" />
            <button type="button" className="profile-avatar-button" onClick={handleAvatarSelect}>
              Alterar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="profile-avatar-input"
              onChange={handleAvatarChange}
            />
          </div>
        )}
      >
        <input type="hidden" name="id" value={form.id} readOnly />
        <Input label="Nome completo" name="name" placeholder="Joana Silva" value={form.name} onChange={handleChange} required={false} />
        <Input label="E-mail" type="email" name="email" placeholder="voce@email.com" value={form.email} onChange={handleChange} required={false} />
        <Input label="Telefone" name="phone" placeholder="(11) 99999-9999" value={form.phone} onChange={handleChange} required={false} />
        <label className="profile-field">
          <span>Edital</span>
          <select name="notice_id" value={form.notice_id} onChange={handleChange}>
            <option value="">Sem edital</option>
            {notices.map((notice) => (
              <option key={notice.id} value={notice.id}>
                {notice.name}{notice.observation ? ` — ${notice.observation}` : ''}
              </option>
            ))}
          </select>
        </label>
        <div className="profile-plan">
          <div>
            <span className="profile-plan-label">Plano atual</span>
            <strong>
              {plans.find((plan) => String(plan.id) === String(user?.plan_id))?.name || 'Sem plano'}
            </strong>
          </div>
          <button type="button" className="link-button" onClick={() => navigate('/plans')}>
            Alterar plano
          </button>
        </div>
        <Input
          label="Nova senha (opcional)"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required={false}
          autoComplete="new-password"
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          name="password_confirmation"
          placeholder="••••••••"
          value={form.password_confirmation}
          onChange={handleChange}
          required={false}
          autoComplete="new-password"
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
