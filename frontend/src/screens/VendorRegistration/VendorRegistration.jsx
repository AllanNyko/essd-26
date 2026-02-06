import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import Status from '../../components/Status'
import { API_BASE_URL, parseJson, getAuthHeaders, getAuthHeadersMultipart } from '../../lib/api'
import './VendorRegistration.css'

const VendorRegistration = () => {
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  
  const [formData, setFormData] = useState({
    company_name: '',
    cnpj: '',
    description: '',
    phone: '',
  })
  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState('')

  const loadVendor = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/vendors/me`, {
        headers: getAuthHeaders(),
      })
      const data = await parseJson(response)
      if (response.ok) {
        setVendor(data?.vendor)
        setFormData({
          company_name: data?.vendor?.company_name || '',
          cnpj: data?.vendor?.cnpj || '',
          description: data?.vendor?.description || '',
          phone: data?.vendor?.phone || '',
        })
        if (data?.vendor?.logo_url) {
          setLogoPreview(`${API_BASE_URL}/storage/${data.vendor.logo_url}`)
        }
      }
    } catch {
      setVendor(null)
    }
  }

  useEffect(() => {
    loadVendor()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'cnpj') {
      let v = value.replace(/\D/g, '')
      v = v.replace(/^(\d{2})(\d)/, '$1.$2')
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      v = v.replace(/\.(\d{3})(\d)/, '.$1/$2')
      v = v.replace(/(\d{4})(\d)/, '$1-$2')
      setFormData(prev => ({ ...prev, [name]: v }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      const data = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key])
      })
      if (logo) {
        data.append('logo', logo)
      }
      
      // Para edição com FormData, Laravel precisa de _method
      if (vendor) {
        data.append('_method', 'PATCH')
      }

      const response = await fetch(`${API_BASE_URL}/vendors${vendor ? `/${vendor.id}` : ''}`, {
        method: 'POST',
        headers: getAuthHeadersMultipart(),
        body: data,
      })

      const result = await parseJson(response)

      if (!response.ok) {
        // Mostrar erros de validação específicos
        if (result?.errors) {
          const errorMessages = Object.values(result.errors).flat().join(' ')
          throw new Error(errorMessages)
        }
        throw new Error(result?.message || 'Erro ao processar solicitação.')
      }

      setStatus({ loading: false, error: '', success: result.message })
      loadVendor()
      
      if (!vendor) {
        setTimeout(() => navigate('/'), 2000)
      }
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  if (vendor && vendor.status === 'pending') {
    return (
      <div className="vendor-registration">
        <div className="card">
          <div className="status-pending">
            <h2>Cadastro em Análise</h2>
            <p>Seu cadastro como vendedor está sendo analisado. Aguarde aprovação da administração.</p>
            <div className="vendor-info">
              <p><strong>Empresa:</strong> {vendor.company_name}</p>
              <p><strong>CNPJ:</strong> {vendor.cnpj}</p>
              <p><strong>Status:</strong> Pendente</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (vendor && vendor.status === 'rejected') {
    return (
      <div className="vendor-registration">
        <div className="card">
          <div className="status-rejected">
            <h2>Cadastro Rejeitado</h2>
            <p>Infelizmente, seu cadastro como vendedor foi rejeitado.</p>
            {vendor.rejection_reason && (
              <div className="rejection-reason">
                <strong>Motivo:</strong> {vendor.rejection_reason}
              </div>
            )}
            <button className="primary" onClick={() => setVendor(null)}>
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="vendor-registration">
      <FormCard
        title={vendor ? 'Editar Informações' : 'Cadastro de Vendedor'}
        description={vendor ? 'Atualize as informações do seu negócio' : 'Preencha os dados para se tornar um vendedor'}
        onSubmit={handleSubmit}
        actionLabel={vendor ? 'Atualizar' : 'Cadastrar'}
        disabled={status.loading}
      >
        <Input
          label="Nome da Empresa"
          name="company_name"
          value={formData.company_name}
          onChange={handleInputChange}
          placeholder="Minha Empresa LTDA"
          required
        />

        <Input
          label="CNPJ"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleInputChange}
          placeholder="00.000.000/0000-00"
          maxLength={18}
          required
        />

        <Input
          label="Telefone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="(11) 98765-4321"
          required={false}
        />

        <Textarea
          label="Descrição do Negócio"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Conte um pouco sobre o seu negócio..."
          rows={5}
          required={false}
        />

        <label className="field">
          <span>Logo da Empresa</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
          />
          {logoPreview && (
            <div className="logo-preview">
              <img src={logoPreview} alt="Logo preview" />
            </div>
          )}
        </label>

        {status.error && <Status type="error" message={status.error} />}
        {status.success && <Status type="success" message={status.success} />}
      </FormCard>
    </div>
  )
}

export default VendorRegistration
