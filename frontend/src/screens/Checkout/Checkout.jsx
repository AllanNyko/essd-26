import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormCard from '../../components/FormCard'
import Input from '../../components/Input'
import Select from '../../components/Select'
import Textarea from '../../components/Textarea'
import Status from '../../components/Status'
import { API_BASE_URL, parseJson, getAuthHeaders } from '../../lib/api'
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const [cartSummary, setCartSummary] = useState(null)
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })
  
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip_code: '',
    shipping_notes: '',
    payment_method: 'external',
  })

  const loadCart = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: getAuthHeaders(),
      })
      const data = await parseJson(response)
      if (response.ok) {
        setCartSummary(data)
        if (data.items_count === 0) {
          navigate('/cart')
        }
      }
    } catch {
      navigate('/cart')
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name === 'shipping_zip_code') {
      let v = value.replace(/\D/g, '')
      v = v.replace(/^(\d{5})(\d)/, '$1-$2')
      setFormData(prev => ({ ...prev, [name]: v }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      })

      const data = await parseJson(response)

      if (!response.ok) {
        throw new Error(data?.message || 'Erro ao finalizar pedido.')
      }

      setStatus({ loading: false, error: '', success: 'Pedido realizado com sucesso!' })
      setTimeout(() => navigate('/orders'), 2000)
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  const paymentMethods = [
    { value: 'external', label: 'Pagamento Externo (Combinar com vendedor)' },
    { value: 'pix', label: 'PIX' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'boleto', label: 'Boleto Bancário' },
  ]

  const estados = [
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' },
    // Add more states as needed
  ]

  if (!cartSummary) {
    return <div className="loading">Carregando...</div>
  }

  return (
    <div className="checkout">
      <div className="checkout-content">
        <FormCard
          title="Finalizar Compra"
          description="Preencha os dados para entrega"
          onSubmit={handleSubmit}
          actionLabel="Confirmar Pedido"
          disabled={status.loading}
        >
          <h3>Dados de Entrega</h3>
          
          <Input
            label="Nome completo"
            name="shipping_name"
            value={formData.shipping_name}
            onChange={handleInputChange}
            placeholder="João da Silva"
            required
          />

          <Input
            label="Telefone"
            name="shipping_phone"
            value={formData.shipping_phone}
            onChange={handleInputChange}
            placeholder="(11) 98765-4321"
            required
          />

          <Input
            label="CEP"
            name="shipping_zip_code"
            value={formData.shipping_zip_code}
            onChange={handleInputChange}
            placeholder="00000-000"
            maxLength={9}
            required
          />

          <Input
            label="Endereço"
            name="shipping_address"
            value={formData.shipping_address}
            onChange={handleInputChange}
            placeholder="Rua, Número, Complemento"
            required
          />

          <div className="form-row">
            <Input
              label="Cidade"
              name="shipping_city"
              value={formData.shipping_city}
              onChange={handleInputChange}
              placeholder="São Paulo"
              required
            />

            <Select
              label="Estado"
              name="shipping_state"
              value={formData.shipping_state}
              onChange={handleInputChange}
              options={estados}
              required
            />
          </div>

          <Textarea
            label="Observações (opcional)"
            name="shipping_notes"
            value={formData.shipping_notes}
            onChange={handleInputChange}
            placeholder="Informações adicionais para entrega..."
            rows={3}
            required={false}
          />

          <h3>Forma de Pagamento</h3>

          <Select
            label="Método de Pagamento"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleInputChange}
            options={paymentMethods}
            required
          />

          {status.error && <Status type="error" message={status.error} />}
          {status.success && <Status type="success" message={status.success} />}
        </FormCard>

        <div className="order-summary">
          <h2>Resumo do Pedido</h2>
          
          <div className="summary-items">
            {cartSummary.cart_items?.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.product?.name} (x{item.quantity})</span>
                <span>R$ {(item.quantity * parseFloat(item.price_snapshot)).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>R$ {parseFloat(cartSummary.total).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Frete:</span>
              <span>A calcular</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>R$ {parseFloat(cartSummary.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
